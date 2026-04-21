# Custom Mystery Box — "Build Your Own"

Let customers curate their own box from existing products, alongside the existing surprise mystery box. Same gift-wrap experience. 10% bundle discount when full box is built.

## Flow

```
/mystery-collection  →  Choice screen (2 cards)
                          ├─ Surprise Box  →  /mystery-collection/surprise   (existing page, just re-route)
                          └─ Build Your Own →  /mystery-collection/build     (new page)
```

## Choice screen (`MysteryCollectionPage.tsx` — refactor)

- Replace current single-purpose hero with a 2-card chooser:
  - **Card 1 — Surprise Box** (existing flow): "Curated by us. Pure discovery." → `/mystery-collection/surprise`
  - **Card 2 — Build Your Own**: "Hand-pick 3–5 pieces. Save 10%." → `/mystery-collection/build`
- Keep the bark/gold hero band, brand voice. Cards use the existing palette (ivory-warm bg, gold accent border on hover).

## Surprise page (`SurpriseMysteryPage.tsx` — moved, not rewritten)

- Move the current `MysteryCollectionPage.tsx` body content into `src/pages/SurpriseMysteryPage.tsx` verbatim. No logic change. Route at `/mystery-collection/surprise`.

## Build page (`BuildYourBoxPage.tsx` — new)

Layout (desktop): left = product grid (filterable by category), right = sticky "Your Box" panel.

**Product grid**

- Loads products from Supabase `products` table, only those with `stock_qty > 0`.
- Category filter chips (All, Rings, Earrings, Necklaces, Bracelets — pulled from `categories`).
- Each product card: 4:5 image, name, price, "Add" button. Selected items show a gold check overlay + "Added".

**Your Box panel (sticky, right column on desktop, bottom sheet on mobile)**

- Shows selected items (thumbnail row), count "X / 5".
- Live price breakdown:
  - Subtotal: ৳XXX
  - Bundle discount (−10%): −৳XX *(only when 3+ items selected)*
  - Total: ৳XXX
- Progress hint: "Pick at least 3 items" / "Add 1 more to maximize" / "Box full — ready!"
- Validation: button disabled until 3 items; max 5 (Add buttons disable on grid).
- "Add Custom Box to Cart" button → adds a single composite cart item, then opens cart drawer.

**Cart item shape** (single line item, not 3 separate ones — keeps gift wrap clean):

```ts
{
  id: `custom-box-${timestamp}`,
  name: `Custom Box · ${itemCount} pieces`,
  price: discountedTotal,           // already net of 10%
  image: firstSelectedItemImage,
  slug: 'custom-mystery-box',
  isMystery: true,                  // ← reuses gift-wrap flow in CartDrawer
  isCustomBox: true,                // ← new flag
  customBoxItems: [{id, name, price, image, slug}, ...],  // for order record
  quantity: 1,
}
```

## CartContext changes

Extend `CartItem`:

```ts
isCustomBox?: boolean;
customBoxItems?: { id: string; name: string; price: number; image: string; slug: string }[];
```

No other context logic changes — `isMystery: true` already triggers gift wrap panel and routes to `mystery_box_orders` at checkout.

## CartDrawer

For custom box items, show a small expandable "View 4 items" line under the box name listing the included pieces (read-only). No quantity controls — custom box is a fixed unit (`updateQty` hidden, `removeItem` removes the whole box).

## CheckoutPage

In the `mystery_box_orders` insert path:

- If `isCustomBox`, populate `items_packed` with the `customBoxItems` JSONB so packing staff knows what to pack.
- `coupon_code` stays null (custom box uses bundle discount, not the surprise-box coupon).
- `campaign_id` stays null for custom boxes.

## App routing

In `App.tsx`:

- `/mystery-collection` → new chooser page
- `/mystery-collection/surprise` → existing surprise box page
- `/mystery-collection/build` → new build page

Add 301-style client redirect from old `/mystery-collection` direct-to-purchase intent? No — the chooser is the new front door, no redirect needed.

## Files

**New:**

- `src/pages/BuildYourBoxPage.tsx`
- `src/pages/SurpriseMysteryPage.tsx` (extracted from current MysteryCollectionPage)
- `src/components/mystery/MysteryChoiceCard.tsx` (small reusable card for chooser)
- `src/components/mystery/BuildBoxPanel.tsx` (the sticky right-side selection panel)
- `src/components/mystery/BuildBoxProductCard.tsx` (grid card with select state)

**Edited:**

- `src/pages/MysteryCollectionPage.tsx` → becomes the chooser (slim)
- `src/context/CartContext.tsx` → add `isCustomBox`, `customBoxItems` fields
- `src/components/CartDrawer.tsx` → custom-box rendering (list contents, hide qty)
- `src/pages/CheckoutPage.tsx` → write `items_packed` for custom boxes
- `src/App.tsx` → add 2 new routes

## Out of scope

- No DB schema changes (existing `mystery_box_orders.items_packed` JSONB column already accepts the contents)
- No new product attributes, no new "boxable" flag on products — every in-stock product is selectable
- No saving/sharing of in-progress boxes (no auth)
- No per-item gift wrap — wrap applies to the whole box, same as surprise

## Edge cases handled

- Empty product list → "Coming back soon" state
- Selecting same product twice → blocked with subtle shake on Add button
- User leaves page mid-build → selection state lives in component only (intentional, simple); cart only gets the finished box  
make sure mystery collection option is in header section
- &nbsp;