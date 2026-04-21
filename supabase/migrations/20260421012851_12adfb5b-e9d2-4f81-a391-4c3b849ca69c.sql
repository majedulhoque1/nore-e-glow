ALTER TABLE public.mystery_box_orders
  ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS gift_message TEXT,
  ADD COLUMN IF NOT EXISTS gift_wrap_type TEXT DEFAULT 'kraft',
  ADD COLUMN IF NOT EXISTS gift_handwritten BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_wrap_cost INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_mystery_orders_gift
  ON public.mystery_box_orders(is_gift, created_at DESC);