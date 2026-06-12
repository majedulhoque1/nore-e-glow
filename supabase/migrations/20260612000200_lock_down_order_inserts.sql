-- ============================================================================
-- Migration B (apply ONLY after the frontend that uses place_order /
-- place_mystery_order RPCs is live — it removes the direct-INSERT path the
-- old checkout depends on).
--
-- 1. Clients can no longer INSERT into order tables directly; the only path
--    is the SECURITY DEFINER RPCs (server-side pricing + rate limiting).
-- 2. coupon_code is no longer readable by clients (it was shown to any
--    visitor; it is meant to be sent after delivery).
-- Safe to re-run (idempotent).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Drop every permissive INSERT policy on the order tables (names vary
--    across older migrations), then add explicit restrictive denies to match
--    the existing pattern on SELECT/UPDATE/DELETE.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT pol.polname, cls.relname
    FROM pg_policy pol
    JOIN pg_class cls ON cls.oid = pol.polrelid
    JOIN pg_namespace nsp ON nsp.oid = cls.relnamespace
    WHERE nsp.nspname = 'public'
      AND cls.relname IN ('orders', 'mystery_box_orders')
      AND pol.polcmd = 'a'          -- INSERT
      AND pol.polpermissive         -- permissive only; keep restrictive denies
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.polname, pol.relname);
  END LOOP;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Deny all client inserts on orders') THEN
    CREATE POLICY "Deny all client inserts on orders"
    ON public.orders
    AS RESTRICTIVE
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Deny all client inserts on mystery_box_orders') THEN
    CREATE POLICY "Deny all client inserts on mystery_box_orders"
    ON public.mystery_box_orders
    AS RESTRICTIVE
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. Hide coupon_code from clients via column-level privileges. The RLS
--    policy "Public can read campaigns" still gates row access; clients must
--    now select explicit columns (the frontend does).
-- ----------------------------------------------------------------------------
REVOKE SELECT ON public.mystery_box_campaigns FROM anon, authenticated;
GRANT SELECT (id, name, price, coupon_amount, coupon_expires_days, description, status, created_at)
  ON public.mystery_box_campaigns TO anon, authenticated;
