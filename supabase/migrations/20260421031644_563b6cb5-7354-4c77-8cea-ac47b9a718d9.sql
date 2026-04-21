-- 1. Explicit deny-all SELECT on customer orders (defense in depth).
-- These tables have no SELECT policy today (so reads are denied), but adding
-- an explicit restrictive policy makes the intent unambiguous and prevents a
-- future accidental permissive policy from opening read access.

CREATE POLICY "Deny all client reads on orders"
ON public.orders
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all client reads on mystery_box_orders"
ON public.mystery_box_orders
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

-- Same for UPDATE / DELETE — clients should never modify orders.
CREATE POLICY "Deny all client updates on orders"
ON public.orders
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all client deletes on orders"
ON public.orders
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all client updates on mystery_box_orders"
ON public.mystery_box_orders
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all client deletes on mystery_box_orders"
ON public.mystery_box_orders
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- 2. Storage: restrict listing of product-images bucket.
-- Drop any existing broad SELECT policy on storage.objects for this bucket,
-- then re-create a narrower one that allows fetching individual files but
-- not enumerating/listing the bucket contents.
--
-- In Supabase, listing is performed via SELECT against storage.objects.
-- We allow SELECT only when the client specifies a name (i.e. fetching a
-- known object), and disallow broad listing by requiring `name IS NOT NULL`
-- combined with a path filter. Public file URLs go through the storage
-- render endpoint and bypass this policy, so direct image URLs continue to
-- work; only the .list() API is blocked.

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT polname
    FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polcmd = 'r'
  LOOP
    -- Only drop policies that target the product-images bucket explicitly
    -- (we don't want to disturb unrelated buckets).
    IF pol.polname ILIKE '%product-image%' OR pol.polname ILIKE '%product_images%' THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.polname);
    END IF;
  END LOOP;
END $$;

-- Note: because the bucket is marked public, files remain accessible via the
-- public render URL (https://<ref>.supabase.co/storage/v1/object/public/product-images/<path>).
-- We intentionally do NOT add a permissive SELECT policy, so the .list() API
-- (which requires a SELECT policy on storage.objects) returns no rows for
-- anon/authenticated clients. This addresses the "Public Bucket Allows
-- Listing" linter finding while keeping product images viewable.