

# Gift Wrapping for Mystery Box

Add an optional gift-wrap layer to mystery box orders. Toggle lives in the cart drawer, adds ৳50, and persists to `mystery_box_orders` in Supabase.

## Database

Migration on `mystery_box_orders`:

```sql
ALTER TABLE mystery_box_orders
  ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS gift_message TEXT,
  ADD COLUMN IF NOT EXISTS gift_wrap_type TEXT DEFAULT 'kraft',
  ADD COLUMN IF NOT EXISTS gift_handwritten BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_wrap_cost INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_mystery_orders_gift
  ON mystery_box_orders(is_gift, created_at DESC);
```

No RLS changes (existing INSERT/SELECT policies cover the new columns).

## New Components

All under `src/components/mystery/`:

1. **`GiftWrapColorSelector.tsx`** — 3-button row (Kraft / Gold / Burgundy) with colored dot, gold border on selected.
2. **`GiftOptionToggle.tsx`** — Checkbox row "Gift wrap for someone special 🎁" with rotating chevron.
3. **`GiftCustomizationPanel.tsx`** — Wraps toggle + (when on) recipient name (40 char), message (100 char), color selector, handwritten/printed toggle, +৳50 summary card. Animates open/close with framer-motion.

## CartContext changes (`src/context/CartContext.tsx`)

Extend `CartItem`:
```ts
isMystery?: boolean;
campaignId?: string;
couponCode?: string;
isGift?: boolean;
giftRecipientName?: string;
giftMessage?: string;
giftWrapType?: 'kraft' | 'gold' | 'burgundy';
giftHandwritten?: boolean;
giftCost?: number;
```

Add `updateCartItem(id, partial)` helper and expose it via context. Keep subtotal logic untouched — gift cost is added at the cart/checkout summary level so subtotal still reflects products only.

## CartDrawer (`src/components/CartDrawer.tsx`)

- Detect `mysteryItem = items.find(i => i.isMystery)`.
- If present, render `<GiftCustomizationPanel>` between items list and footer; on change, call `updateCartItem(mysteryItem.id, { isGift, giftRecipientName, giftMessage, giftWrapType, giftHandwritten, giftCost: isGift ? 50 : 0 })`.
- Footer totals: show Subtotal, optional `Gift wrap +৳50` line, then existing checkout button updated to `Checkout · ৳{subtotal + giftCost}` (delivery still calculated at checkout).

## CheckoutPage (`src/pages/CheckoutPage.tsx`)

- Compute `mysteryItem` and `giftCost`.
- Order Summary panel: insert "Gift wrap" line under Subtotal with wrap type + message style sub-text.
- Total = `subtotal + giftCost + deliveryCharge`.
- **Routing logic:** if `mysteryItem` is in cart, insert into `mystery_box_orders` with all gift fields + `campaign_id`, `coupon_code`. Otherwise keep existing `orders` insert path. (Currently everything goes to `orders` — this split is needed for gift fields to land in the right table.)

## Mystery page (`src/pages/MysteryCollectionPage.tsx`)

No structural changes. Verify the "Add to Cart" already passes `isMystery: true`, `campaignId`, `couponCode` so CartDrawer can detect it. If not, patch the addItem call.

## Files touched

- New: `src/components/mystery/GiftCustomizationPanel.tsx`, `GiftOptionToggle.tsx`, `GiftWrapColorSelector.tsx`
- Edited: `src/context/CartContext.tsx`, `src/components/CartDrawer.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/MysteryCollectionPage.tsx` (only if mystery flag missing)
- Migration: ALTER on `mystery_box_orders`

## Out of scope

- No admin dashboard, no n8n, no packing automation
- No changes to non-mystery orders
- No new env vars or design tokens

