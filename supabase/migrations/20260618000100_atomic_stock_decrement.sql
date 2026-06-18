-- ============================================================================
-- Atomic stock enforcement at order time.
--
-- Problem: stock_qty was a manual number that orders never touched, so the same
-- in-stock piece could be sold to multiple customers ("oversell").
--
-- Fix: decrement stock inside the existing SECURITY DEFINER order RPCs, in the
-- same transaction that creates the order, using a conditional UPDATE that only
-- succeeds when enough stock remains. Postgres row-locks serialize concurrent
-- orders automatically, so stock = 3 with 4 simultaneous orders => exactly 3
-- succeed and the 4th is rejected with out_of_stock. All-or-nothing: if any line
-- item is short, the whole order rolls back.
--
-- Rules:
--   * stock_qty IS NULL  => "untracked" (unlimited): sold freely, not decremented.
--   * stock_qty IS NOT NULL => enforced and decremented.
--   * Surprise-box campaigns draw from a separate inventory model and are NOT
--     decremented here; only custom-box picks and extra cart items are.
--
-- Safe to re-run (idempotent: CREATE OR REPLACE only).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper: atomically decrement stock for a [{ "id": uuid, "quantity": n }]
--    list. Raises 'out_of_stock:<product name>' if any tracked item is short.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._order_decrement_stock(p_items JSONB)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_updated   INTEGER;
  v_exists    BOOLEAN;
  v_untracked BOOLEAN;
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RETURN;
  END IF;

  -- Aggregate duplicate ids and lock rows in a deterministic order (by id) so
  -- concurrent multi-item orders can never deadlock against each other.
  FOR r IN
    SELECT (e->>'id')::uuid AS id, sum((e->>'quantity')::int) AS quantity
    FROM jsonb_array_elements(p_items) e
    GROUP BY (e->>'id')::uuid
    ORDER BY (e->>'id')::uuid
  LOOP
    -- Atomic conditional decrement: applies only if enough stock remains.
    UPDATE public.products
       SET stock_qty = stock_qty - r.quantity
     WHERE id = r.id
       AND stock_qty IS NOT NULL          -- NULL = untracked / unlimited
       AND stock_qty >= r.quantity;
    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated = 0 THEN
      -- No row changed: product missing, untracked, or insufficient stock.
      SELECT EXISTS (SELECT 1 FROM public.products WHERE id = r.id),
             EXISTS (SELECT 1 FROM public.products WHERE id = r.id AND stock_qty IS NULL)
        INTO v_exists, v_untracked;

      IF v_exists AND v_untracked THEN
        CONTINUE;  -- untracked stock: sell freely, nothing to decrement
      END IF;

      RAISE EXCEPTION 'out_of_stock:%',
        COALESCE((SELECT name FROM public.products WHERE id = r.id), 'item');
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public._order_decrement_stock(JSONB) FROM PUBLIC, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2. place_order — regular product orders (now decrements stock).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.place_order(
  p_items JSONB,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_address TEXT,
  p_district TEXT,
  p_upazila TEXT,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip TEXT := public._order_client_ip();
  v_items JSONB;
  v_subtotal INTEGER;
  v_delivery INTEGER;
  v_total INTEGER;
  v_order_number TEXT;
BEGIN
  PERFORM public._order_guard(p_customer_name, p_customer_phone, p_address, p_district, p_upazila, v_ip);

  IF p_note IS NOT NULL AND char_length(p_note) > 1000 THEN
    RAISE EXCEPTION 'invalid_note';
  END IF;

  SELECT r.items, r.subtotal INTO v_items, v_subtotal
  FROM public._order_resolve_items(p_items) r;
  IF v_items IS NULL THEN
    RAISE EXCEPTION 'invalid_items';
  END IF;

  -- Reserve stock atomically (rolls back the whole order if anything is short).
  PERFORM public._order_decrement_stock(p_items);

  v_delivery := CASE WHEN p_district = 'Dhaka' THEN 60 ELSE 120 END;
  v_total := v_subtotal + v_delivery;
  v_order_number := public._order_number();

  INSERT INTO public.orders (
    order_number, items, subtotal, delivery_charge, total,
    customer_name, customer_phone, address, district, upazila, note, client_ip
  ) VALUES (
    v_order_number, v_items, v_subtotal, v_delivery, v_total,
    trim(p_customer_name), p_customer_phone, trim(p_address), trim(p_district), trim(p_upazila),
    NULLIF(trim(COALESCE(p_note, '')), ''), v_ip
  );

  RETURN jsonb_build_object('order_number', v_order_number, 'total', v_total);
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. place_mystery_order — custom-box picks + extra items now decrement stock.
--    Surprise-box (campaign) contents are packed from a separate inventory and
--    are intentionally NOT decremented here.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.place_mystery_order(
  p_campaign_id UUID,
  p_custom_box_item_ids UUID[],
  p_box_quantity INTEGER,
  p_is_gift BOOLEAN,
  p_gift_recipient_name TEXT,
  p_gift_message TEXT,
  p_gift_wrap_type TEXT,
  p_gift_handwritten BOOLEAN,
  p_extra_items JSONB,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_address TEXT,
  p_district TEXT,
  p_upazila TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip TEXT := public._order_client_ip();
  v_campaign public.mystery_box_campaigns%ROWTYPE;
  v_box_qty INTEGER := COALESCE(p_box_quantity, 1);
  v_box_price INTEGER;
  v_coupon TEXT := NULL;
  v_items_packed JSONB := NULL;
  v_extra_items JSONB := NULL;
  v_extra_subtotal INTEGER := 0;
  v_gift_cost INTEGER := 0;
  v_wrap_type TEXT := COALESCE(p_gift_wrap_type, 'kraft');
  v_delivery INTEGER;
  v_total INTEGER;
  v_order_number TEXT;
  v_custom_sum INTEGER;
  v_custom_count INTEGER;
BEGIN
  PERFORM public._order_guard(p_customer_name, p_customer_phone, p_address, p_district, p_upazila, v_ip);

  IF v_box_qty < 1 OR v_box_qty > 10 THEN
    RAISE EXCEPTION 'invalid_quantity';
  END IF;

  -- Exactly one of: campaign (surprise box) / custom box picks.
  IF (p_campaign_id IS NULL) = (p_custom_box_item_ids IS NULL) THEN
    RAISE EXCEPTION 'invalid_box';
  END IF;

  IF p_campaign_id IS NOT NULL THEN
    SELECT * INTO v_campaign FROM public.mystery_box_campaigns WHERE id = p_campaign_id;
    IF NOT FOUND OR COALESCE(v_campaign.status, 'inactive') <> 'active' THEN
      RAISE EXCEPTION 'campaign_inactive';
    END IF;
    v_box_price := v_campaign.price;
    v_coupon := v_campaign.coupon_code;
  ELSE
    SELECT count(DISTINCT u) INTO v_custom_count FROM unnest(p_custom_box_item_ids) u;
    IF v_custom_count <> array_length(p_custom_box_item_ids, 1)
       OR v_custom_count < 3 OR v_custom_count > 5 THEN
      RAISE EXCEPTION 'invalid_box';
    END IF;

    SELECT sum(p.price)::int,
           jsonb_agg(jsonb_build_object(
             'id', p.id, 'name', p.name, 'price', p.price,
             'image', COALESCE(p.images[1], '/placeholder.svg'), 'slug', p.slug))
      INTO v_custom_sum, v_items_packed
    FROM public.products p
    WHERE p.id = ANY (p_custom_box_item_ids) AND COALESCE(p.stock_qty, 0) > 0;

    IF v_custom_sum IS NULL
       OR (SELECT count(*) FROM public.products p
            WHERE p.id = ANY (p_custom_box_item_ids) AND COALESCE(p.stock_qty, 0) > 0) <> v_custom_count THEN
      RAISE EXCEPTION 'invalid_box';
    END IF;

    -- 10% bundle discount, same rounding as the storefront.
    v_box_price := v_custom_sum - round(v_custom_sum * 0.1)::int;
  END IF;

  IF COALESCE(p_is_gift, false) THEN
    IF v_wrap_type NOT IN ('kraft', 'gold', 'burgundy') THEN
      RAISE EXCEPTION 'invalid_gift';
    END IF;
    IF p_gift_recipient_name IS NOT NULL AND char_length(p_gift_recipient_name) > 80 THEN
      RAISE EXCEPTION 'invalid_gift';
    END IF;
    IF p_gift_message IS NOT NULL AND char_length(p_gift_message) > 300 THEN
      RAISE EXCEPTION 'invalid_gift';
    END IF;
    v_gift_cost := 50;
  END IF;

  IF p_extra_items IS NOT NULL THEN
    SELECT r.items, r.subtotal INTO v_extra_items, v_extra_subtotal
    FROM public._order_resolve_items(p_extra_items) r;
    IF v_extra_items IS NULL THEN
      RAISE EXCEPTION 'invalid_items';
    END IF;
  END IF;

  -- Reserve stock atomically, after all validation so we never decrement then
  -- fail. Custom-box picks consume v_box_qty units each; extra items their own
  -- quantity. Combined into one call so all rows lock in a single id-ordered
  -- pass (deadlock-safe). Campaign surprise boxes are excluded here (separate
  -- inventory model), so their picks contribute nothing to this list.
  PERFORM public._order_decrement_stock(
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('id', u, 'quantity', v_box_qty))
         FROM unnest(p_custom_box_item_ids) u),
      '[]'::jsonb)
    || COALESCE(p_extra_items, '[]'::jsonb)
  );

  v_delivery := CASE WHEN p_district = 'Dhaka' THEN 60 ELSE 120 END;
  v_total := v_box_price * v_box_qty + v_extra_subtotal + v_gift_cost + v_delivery;
  v_order_number := public._order_number();

  INSERT INTO public.mystery_box_orders (
    order_number, campaign_id, coupon_code, delivery_charge, total,
    customer_name, customer_phone, address, district, upazila,
    is_gift, gift_recipient_name, gift_message, gift_wrap_type, gift_handwritten, gift_wrap_cost,
    items_packed, extra_items, box_quantity, client_ip
  ) VALUES (
    v_order_number, p_campaign_id, v_coupon, v_delivery, v_total,
    trim(p_customer_name), p_customer_phone, trim(p_address), trim(p_district), trim(p_upazila),
    COALESCE(p_is_gift, false),
    CASE WHEN COALESCE(p_is_gift, false) THEN NULLIF(trim(COALESCE(p_gift_recipient_name, '')), '') END,
    CASE WHEN COALESCE(p_is_gift, false) THEN NULLIF(trim(COALESCE(p_gift_message, '')), '') END,
    v_wrap_type, COALESCE(p_gift_handwritten, true), v_gift_cost,
    v_items_packed, v_extra_items, v_box_qty, v_ip
  );

  RETURN jsonb_build_object('order_number', v_order_number, 'total', v_total);
END;
$$;

-- ----------------------------------------------------------------------------
-- 4. Re-assert client execute grants (CREATE OR REPLACE keeps them, but be
--    explicit so the contract is unambiguous).
-- ----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.place_order(JSONB, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(JSONB, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.place_mystery_order(UUID, UUID[], INTEGER, BOOLEAN, TEXT, TEXT, TEXT, BOOLEAN, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_mystery_order(UUID, UUID[], INTEGER, BOOLEAN, TEXT, TEXT, TEXT, BOOLEAN, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
