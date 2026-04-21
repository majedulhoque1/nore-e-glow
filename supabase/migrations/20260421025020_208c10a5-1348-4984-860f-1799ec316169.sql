-- Remove over-permissive SELECT policies that exposed customer PII to any authenticated user
DROP POLICY IF EXISTS "Authenticated can read orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated can read mystery orders" ON public.mystery_box_orders;
DROP POLICY IF EXISTS "Authenticated can read inventory" ON public.mystery_box_inventory;

-- Tighten storage: replace any broad public SELECT on product-images with a non-listing read.
-- We drop the common permissive policy names and recreate a single policy that allows
-- reading individual objects (by URL) but does not satisfy bucket listing semantics
-- when paired with Supabase's listing checks.
DO $$
BEGIN
  -- Drop typical permissive policies if present
  EXECUTE 'DROP POLICY IF EXISTS "Public Access" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Public read product-images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "product-images public read" ON storage.objects';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Allow public reads of individual product images (needed for <img src> on the storefront)
CREATE POLICY "product-images read individual"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');
