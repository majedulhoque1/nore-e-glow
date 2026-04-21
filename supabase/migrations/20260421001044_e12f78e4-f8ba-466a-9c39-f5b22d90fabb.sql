-- Mystery box campaign config
CREATE TABLE public.mystery_box_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  coupon_code TEXT NOT NULL,
  coupon_amount INTEGER NOT NULL,
  coupon_expires_days INTEGER DEFAULT 30,
  description TEXT,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products tagged for mystery inclusion
CREATE TABLE public.mystery_box_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.mystery_box_campaigns(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  is_packed BOOLEAN DEFAULT false,
  packed_into_order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mystery box orders
CREATE TABLE public.mystery_box_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.mystery_box_campaigns(id),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  upazila TEXT NOT NULL,
  delivery_charge INTEGER DEFAULT 60,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  coupon_code TEXT,
  items_packed JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.mystery_box_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_box_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_box_orders ENABLE ROW LEVEL SECURITY;

-- Public can read active campaigns
CREATE POLICY "Public can read campaigns"
ON public.mystery_box_campaigns FOR SELECT
TO anon, authenticated
USING (true);

-- Inventory readable by authenticated only (admin-ish)
CREATE POLICY "Authenticated can read inventory"
ON public.mystery_box_inventory FOR SELECT
TO authenticated
USING (true);

-- Anyone can place a mystery order
CREATE POLICY "Anyone can place mystery order"
ON public.mystery_box_orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated can read orders
CREATE POLICY "Authenticated can read mystery orders"
ON public.mystery_box_orders FOR SELECT
TO authenticated
USING (true);