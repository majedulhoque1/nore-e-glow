-- Minimal bootstrap so the real stock-decrement migration can run under pglite.
-- Provides the Supabase roles, the tables the order RPCs touch, and the four
-- helper functions defined in earlier migrations that the RPCs depend on.
-- The functions under test (place_order / place_mystery_order /
-- _order_decrement_stock) are loaded from the actual migration file, not here.

-- Supabase roles referenced by the migration's GRANT/REVOKE statements.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END $$;

-- ---- Tables (minimal columns the RPCs read/write) --------------------------
CREATE TABLE public.products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  price      INTEGER NOT NULL,
  images     TEXT[],
  slug       TEXT,
  stock_qty  INTEGER
);

CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT,
  items           JSONB,
  subtotal        INTEGER,
  delivery_charge INTEGER,
  total           INTEGER,
  customer_name   TEXT,
  customer_phone  TEXT,
  address         TEXT,
  district        TEXT,
  upazila         TEXT,
  note            TEXT,
  client_ip       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.mystery_box_campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT,
  price       INTEGER,
  coupon_code TEXT,
  status      TEXT
);

CREATE TABLE public.mystery_box_orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         TEXT,
  campaign_id          UUID,
  coupon_code          TEXT,
  delivery_charge      INTEGER,
  total                INTEGER,
  customer_name        TEXT,
  customer_phone       TEXT,
  address              TEXT,
  district             TEXT,
  upazila              TEXT,
  is_gift              BOOLEAN,
  gift_recipient_name  TEXT,
  gift_message         TEXT,
  gift_wrap_type       TEXT,
  gift_handwritten     BOOLEAN,
  gift_wrap_cost       INTEGER,
  items_packed         JSONB,
  extra_items          JSONB,
  box_quantity         INTEGER,
  client_ip            TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- Helper functions the RPCs depend on (copied from migration A) ----------
CREATE OR REPLACE FUNCTION public._order_client_ip()
RETURNS TEXT LANGUAGE plpgsql STABLE AS $$
DECLARE v_headers JSONB;
BEGIN
  BEGIN
    v_headers := current_setting('request.headers', true)::jsonb;
  EXCEPTION WHEN OTHERS THEN RETURN NULL;
  END;
  RETURN NULLIF(split_part(COALESCE(v_headers->>'x-forwarded-for', ''), ',', 1), '');
END; $$;

CREATE OR REPLACE FUNCTION public._order_guard(
  p_customer_name TEXT, p_customer_phone TEXT, p_address TEXT,
  p_district TEXT, p_upazila TEXT, p_client_ip TEXT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone_count INTEGER; v_ip_count INTEGER;
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

  SELECT (SELECT count(*) FROM public.orders
            WHERE customer_phone = p_customer_phone AND created_at > now() - interval '1 hour')
       + (SELECT count(*) FROM public.mystery_box_orders
            WHERE customer_phone = p_customer_phone AND created_at > now() - interval '1 hour')
    INTO v_phone_count;
  IF v_phone_count >= 3 THEN RAISE EXCEPTION 'rate_limited'; END IF;

  IF p_client_ip IS NOT NULL THEN
    SELECT (SELECT count(*) FROM public.orders
              WHERE client_ip = p_client_ip AND created_at > now() - interval '1 hour')
         + (SELECT count(*) FROM public.mystery_box_orders
              WHERE client_ip = p_client_ip AND created_at > now() - interval '1 hour')
      INTO v_ip_count;
    IF v_ip_count >= 10 THEN RAISE EXCEPTION 'rate_limited'; END IF;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public._order_resolve_items(p_items JSONB)
RETURNS TABLE (items JSONB, subtotal INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count INTEGER;
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN RAISE EXCEPTION 'invalid_items'; END IF;
  v_count := jsonb_array_length(p_items);
  IF v_count < 1 OR v_count > 30 THEN RAISE EXCEPTION 'invalid_items'; END IF;

  RETURN QUERY
  WITH requested AS (
    SELECT (e->>'id')::uuid AS id, (e->>'quantity')::int AS quantity
    FROM jsonb_array_elements(p_items) e
  ),
  checked AS (
    SELECT r.id, r.quantity, p.name, p.price,
           COALESCE(p.images[1], '/placeholder.svg') AS image
    FROM requested r JOIN public.products p ON p.id = r.id
  )
  SELECT
    jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'price', c.price,
                                 'quantity', c.quantity, 'image', c.image)),
    COALESCE(sum(c.price * c.quantity), 0)::int
  FROM checked c
  WHERE (SELECT count(*) FROM checked) = (SELECT count(*) FROM requested)
    AND NOT EXISTS (SELECT 1 FROM requested q WHERE q.quantity IS NULL OR q.quantity < 1 OR q.quantity > 99);
END; $$;

CREATE OR REPLACE FUNCTION public._order_number()
RETURNS TEXT LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_num TEXT; v_try INTEGER := 0;
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
END; $$;
