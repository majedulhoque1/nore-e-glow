-- ============================================================================
-- Migration A (additive, backward-compatible)
-- Server-side order creation: prices/totals computed in the database,
-- basic rate limiting, input validation, and storage bucket hardening.
--
-- The old direct-INSERT path keeps working until the frontend that calls
-- these RPCs is deployed. Migration B then removes the direct-INSERT path.
-- Safe to re-run (idempotent).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. New columns
--    extra_items: regular cart items that accompany a mystery box order
--                 (previously silently dropped at checkout).
--    box_quantity: how many mystery boxes (cart allows qty > 1; previously
--                  only recoverable by dividing total by price).
--    client_ip: for rate limiting; tables are not client-readable.
-- ----------------------------------------------------------------------------
ALTER TABLE public.mystery_box_orders
  ADD COLUMN IF NOT EXISTS extra_items JSONB,
  ADD COLUMN IF NOT EXISTS box_quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS client_ip TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS client_ip TEXT;

-- ----------------------------------------------------------------------------
-- 2. CHECK constraints (NOT VALID: enforced for new rows only, so existing
--    rows can never block the migration). Defense in depth — the RPCs below
--    validate the same things with friendlier errors.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT * FROM (VALUES
      ('orders',             'orders_name_len_chk',        'char_length(customer_name) BETWEEN 2 AND 120'),
      ('orders',             'orders_phone_format_chk',    $chk$customer_phone ~ '^01[3-9][0-9]{8}$'$chk$),
      ('orders',             'orders_address_len_chk',     'char_length(address) BETWEEN 5 AND 1000'),
      ('orders',             'orders_district_len_chk',    'char_length(district) BETWEEN 2 AND 60'),
      ('orders',             'orders_upazila_len_chk',     'char_length(upazila) BETWEEN 2 AND 120'),
      ('orders',             'orders_note_len_chk',        'note IS NULL OR char_length(note) <= 1000'),
      ('orders',             'orders_amounts_chk',         'subtotal >= 0 AND total >= 0 AND delivery_charge BETWEEN 0 AND 1000'),
      ('mystery_box_orders', 'mbo_name_len_chk',           'char_length(customer_name) BETWEEN 2 AND 120'),
      ('mystery_box_orders', 'mbo_phone_format_chk',       $chk$customer_phone ~ '^01[3-9][0-9]{8}$'$chk$),
      ('mystery_box_orders', 'mbo_address_len_chk',        'char_length(address) BETWEEN 5 AND 1000'),
      ('mystery_box_orders', 'mbo_district_len_chk',       'char_length(district) BETWEEN 2 AND 60'),
      ('mystery_box_orders', 'mbo_upazila_len_chk',        'char_length(upazila) BETWEEN 2 AND 120'),
      ('mystery_box_orders', 'mbo_gift_recipient_len_chk', 'gift_recipient_name IS NULL OR char_length(gift_recipient_name) <= 80'),
      ('mystery_box_orders', 'mbo_gift_message_len_chk',   'gift_message IS NULL OR char_length(gift_message) <= 300'),
      ('mystery_box_orders', 'mbo_box_quantity_chk',       'box_quantity BETWEEN 1 AND 10'),
      ('mystery_box_orders', 'mbo_amounts_chk',            'total >= 0 AND COALESCE(delivery_charge, 0) BETWEEN 0 AND 1000 AND COALESCE(gift_wrap_cost, 0) BETWEEN 0 AND 1000'),
      ('products',           'products_price_chk',         'price >= 0 AND COALESCE(compare_at_price, 0) >= 0'),
      ('products',           'products_stock_chk',         'COALESCE(stock_qty, 0) >= 0')
    ) AS t(tbl, conname, expr)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = c.conname AND connamespace = 'public'::regnamespace
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (%s) NOT VALID', c.tbl, c.conname, c.expr);
    END IF;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Helpers (private schema-less functions, not exposed: EXECUTE revoked)
-- ----------------------------------------------------------------------------

-- Read caller IP from PostgREST headers (NULL outside PostgREST).
CREATE OR REPLACE FUNCTION public._order_client_ip()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_headers JSONB;
BEGIN
  BEGIN
    v_headers := current_setting('request.headers', true)::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
  RETURN NULLIF(split_part(COALESCE(v_headers->>'x-forwarded-for', ''), ',', 1), '');
END;
$$;

-- Shared validation + rate limiting. Raises on failure.
CREATE OR REPLACE FUNCTION public._order_guard(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_address TEXT,
  p_district TEXT,
  p_upazila TEXT,
  p_client_ip TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone_count INTEGER;
  v_ip_count INTEGER;
BEGIN
  IF p_customer_name IS NULL OR char_length(trim(p_customer_name)) NOT BETWEEN 3 AND 120 THEN
    RAISE EXCEPTION 'invalid_name';
  END IF;
  IF p_customer_phone IS NULL OR p_customer_phone !~ '^01[3-9][0-9]{8}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;
  IF p_address IS NULL OR char_length(trim(p_address)) NOT BETWEEN 10 AND 1000 THEN
    RAISE EXCEPTION 'invalid_address';
  END IF;
  IF p_district IS NULL OR char_length(trim(p_district)) NOT BETWEEN 2 AND 60 THEN
    RAISE EXCEPTION 'invalid_district';
  END IF;
  IF p_upazila IS NULL OR char_length(trim(p_upazila)) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'invalid_upazila';
  END IF;

  -- Rate limits across both order tables: 3/hour per phone, 10/hour per IP.
  SELECT (SELECT count(*) FROM public.orders
            WHERE customer_phone = p_customer_phone AND created_at > now() - interval '1 hour')
       + (SELECT count(*) FROM public.mystery_box_orders
            WHERE customer_phone = p_customer_phone AND created_at > now() - interval '1 hour')
    INTO v_phone_count;
  IF v_phone_count >= 3 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  IF p_client_ip IS NOT NULL THEN
    SELECT (SELECT count(*) FROM public.orders
              WHERE client_ip = p_client_ip AND created_at > now() - interval '1 hour')
         + (SELECT count(*) FROM public.mystery_box_orders
              WHERE client_ip = p_client_ip AND created_at > now() - interval '1 hour')
      INTO v_ip_count;
    IF v_ip_count >= 10 THEN
      RAISE EXCEPTION 'rate_limited';
    END IF;
  END IF;
END;
$$;

-- Resolve client-sent [{"id": uuid, "quantity": n}] against the products
-- table. Returns authoritative line items and subtotal; never trusts prices.
CREATE OR REPLACE FUNCTION public._order_resolve_items(p_items JSONB)
RETURNS TABLE (items JSONB, subtotal INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'invalid_items';
  END IF;
  v_count := jsonb_array_length(p_items);
  IF v_count < 1 OR v_count > 30 THEN
    RAISE EXCEPTION 'invalid_items';
  END IF;

  RETURN QUERY
  WITH requested AS (
    SELECT (e->>'id')::uuid AS id,
           (e->>'quantity')::int AS quantity
    FROM jsonb_array_elements(p_items) e
  ),
  checked AS (
    SELECT r.id, r.quantity, p.name, p.price,
           COALESCE(p.images[1], '/placeholder.svg') AS image
    FROM requested r
    JOIN public.products p ON p.id = r.id
  )
  SELECT
    jsonb_agg(jsonb_build_object(
      'id', c.id, 'name', c.name, 'price', c.price,
      'quantity', c.quantity, 'image', c.image)),
    COALESCE(sum(c.price * c.quantity), 0)::int
  FROM checked c
  WHERE (SELECT count(*) FROM checked) = (SELECT count(*) FROM requested)
    AND NOT EXISTS (SELECT 1 FROM requested q WHERE q.quantity IS NULL OR q.quantity < 1 OR q.quantity > 99);
END;
$$;

-- Collision-safe short order number.
CREATE OR REPLACE FUNCTION public._order_number()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_num TEXT;
  v_try INTEGER := 0;
BEGIN
  LOOP
    v_try := v_try + 1;
    v_num := 'NR-' || lpad(floor(random() * 900000 + 100000)::text, 6, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_num)
          AND NOT EXISTS (SELECT 1 FROM public.mystery_box_orders WHERE order_number = v_num);
    IF v_try >= 20 THEN
      v_num := 'NR-' || to_char(now(), 'YYMMDDHH24MISS') || floor(random() * 90 + 10)::text;
      EXIT;
    END IF;
  END LOOP;
  RETURN v_num;
END;
$$;

-- ----------------------------------------------------------------------------
-- 4. place_order — regular product orders
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
-- 5. place_mystery_order — surprise box (campaign) or custom box (3–5 picks),
--    optional gift wrap, optional extra regular items in the same cart.
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
-- 6. Function privileges: only the two public RPCs are callable by clients.
-- ----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._order_client_ip() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._order_guard(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._order_resolve_items(JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._order_number() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.place_order(JSONB, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(JSONB, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.place_mystery_order(UUID, UUID[], INTEGER, BOOLEAN, TEXT, TEXT, TEXT, BOOLEAN, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_mystery_order(UUID, UUID[], INTEGER, BOOLEAN, TEXT, TEXT, TEXT, BOOLEAN, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 7. Rate-limit query support + storage bucket hardening
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_phone_created ON public.orders (customer_phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_ip_created ON public.orders (client_ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mbo_phone_created ON public.mystery_box_orders (customer_phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mbo_ip_created ON public.mystery_box_orders (client_ip, created_at DESC);

-- 5 MB max upload, images only (server-side enforcement of upload limits).
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
WHERE id = 'product-images';
