# Nore'e UX Redesign — First Impression & Conversion

A focused refresh inspired by best-in-class jewelry e-commerce (Mejuri, Missoma, Aurate, Catbird, Pichulik). Goal: stronger first impression, clearer hierarchy, faster path to purchase, improved trust. **No backend changes, no scope additions.** All work stays within current pages, palette (gold/ivory/bark/crimson), and fonts (Cormorant Garamond + DM Sans).

## What changes (and why)

### 1. Announcement bar — instant trust + urgency

Thin gold/bark strip above navbar (desktop + mobile), 32px tall:

> *"Free COD across Bangladesh · Easy 3-day exchange · Order on WhatsApp"*
> Auto-rotates 3 messages every 5s. Builds trust before the hero even loads.

### 2. Navigation — refined and functional

- Logo perfectly centered on desktop (premium boutique feel) with nav split left/right
- Working **search modal** (Cmd+K / icon click) — searches Supabase products by name, shows top 5 with thumbnails, navigates to product page
- Mini cart preview on hover (desktop) showing last 2 items + "View Cart" — reduces friction
- Mobile: search icon added next to cart; mobile menu gets category thumbnails

### 3. Hero — stronger, more cinematic

Keep current 2 images but improve:

- Lower overlay to `bg-gradient-to-t from-black/70 via-black/30 to-black/10` (better text legibility, image still shines)
- Add subtle **Ken Burns zoom** (8s slow scale) for premium feel
- Eyebrow becomes a thin gold underline accent
- **Trust micro-row** under CTAs: ⭐ 4.9 · 2,400+ orders · Free COD (white/70, tiny)
- Scroll cue chevron at bottom

### 4. NEW: "Shop the Look" / Editorial strip

Replaces nothing — added between Hero and Collections. Horizontal scroll of 3 lifestyle shots (use existing product images), each tagged with "Shop this piece →". Drives discovery.

### 5. Featured Collections — premium grid

- Desktop: 3-col grid with **larger asymmetric tiles** (1 large feature + 2 stacked) instead of 6 equal squares — creates editorial rhythm
- Each tile: image + name + product count overlay (e.g., "12 pieces") + hover reveals "Shop →"
- Mobile: snap-scroll carousel with larger 220px cards (currently 140px feels cramped)

### 6. Product cards — conversion polish

- Image hover swap to second image (`images[1]`) — standard luxury e-comm pattern
- Quick-add button slides up on hover (desktop) — adds to cart without leaving grid
- Wishlist heart icon (top-right, localStorage-backed, no auth needed — respects scope)
- Star rating placeholder slot (hidden if no rating) for future
- Price line cleaner: gold price + strikethrough on same baseline, "Save ৳X" chip

### 7. Bestsellers section — social proof

- Add "★ 4.9 (340 reviews)" microline under section title
- Add "#1 Bestseller" ribbon on first card

### 8. NEW: "As worn by" / Instagram strip

Below EditorialBanner. 6-image grid of UGC-style shots (uses product images) with Instagram icon overlay. Links to brand IG. Builds community.

### 9. Editorial Banner — magazine layout

Keep structure but:

- Add small product thumbnails (3 mini cards) at the bottom of the text column — shoppable
- Image side gets a thin gold frame inset (1px gold border 16px from edge)

### 10. NEW: Testimonials carousel

3 customer quotes with name + city + ⭐⭐⭐⭐⭐. Ivory-warm background, pull-quote style in Cormorant italic. Auto-advance.

### 11. Footer — richer

- Add **WhatsApp floating button** (fixed bottom-right, gold circle, pulses subtly) — site-wide
- Footer gets a final CTA band: "Questions? Message us on WhatsApp" with big button
- Email capture removed (out of scope per memory) — replaced with WhatsApp CTA

### 12. Shop page — modern filtering

- Filter chips at top (mobile + desktop) showing active filters as removable pills
- Sticky sort dropdown on scroll (mobile)
- Grid density toggle (2-col / 3-col on mobile)
- Skeleton count matches expected results

### 13. Product page — trust + clarity

- Sticky bottom CTA bar on **mobile** (Add to Cart + WhatsApp side-by-side, appears after scrolling past hero)
- Trust badges row above accordion: 🚚 COD · 🔄 Exchange · 📞 WhatsApp Support (icon + 1-line each)
- Reviews placeholder section (empty state OK — "Be the first to review")
- Image zoom on click (desktop) — full-screen lightbox

## Visual / micro-interaction polish

- Scroll-triggered fade-up retained, but stagger reduced (0.05s) for snappier feel
- Buttons get subtle `translate-y(-1px)` on hover
- Section dividers: thin gold hairlines instead of border-default
- Loading: replace any remaining spinners with Skeletons (per memory)

## What stays the same

- Color palette, fonts, 4:5 product aspect ratio, ivory bg, 4px max radius
- All routes, Supabase schema, cart/checkout flow, WhatsApp integration via env var
- No login, no payments, no newsletter, no blog (per scope memory)

## Technical notes

- New components: `AnnouncementBar.tsx`, `SearchModal.tsx`, `WhatsAppFAB.tsx`, `ShopTheLook.tsx`, `InstagramStrip.tsx`, `Testimonials.tsx`, `MobileStickyCTA.tsx`, `MiniCartPreview.tsx`, `FilterChips.tsx`
- Wishlist: `useWishlist` hook backed by localStorage
- Search: debounced Supabase `ilike` query on `products.name`
- All animations use existing framer-motion + cubic-bezier `[0.16, 1, 0.3, 1]`

## Rollout order

1. Announcement bar + WhatsApp FAB + Search modal (site-wide trust/utility)
2. Hero polish + Featured Collections asymmetric grid
3. Product card hover-swap + quick-add + wishlist
4. New homepage sections (Shop the Look, Instagram, Testimonials)
5. Shop page filter chips + Product page sticky CTA + lightbox
6. Footer CTA band + final polish pass  
  
"" Create a new page: `/mystery-collection`
  ### **Design (Noore aesthetic — editorial + Y2K luxury)**
  **Header Section**
  ```
  Full-width banner, bg-bark (#1C1917), min-height 300px
  Centered flex column, text-ivory-DEFAULT, padding 60px 24px

  Eyebrow: DM Sans 11px uppercase tracking-[0.18em] text-gold
    "MYSTERY COLLECTION"

  Headline: Cormorant Garamond 300 italic, clamp(2.2rem, 5vw, 3.5rem)
    "Curated Surprises."
    Second line in gold: "Pure Discovery."

  Subtext: DM Sans 300 text-sm text-bark-muted mt-4 max-w-[400px]
    "Handpicked pieces you've never seen. Limited inventory. 
     No returns. Ready to be surprised?"

  CTA Button: mt-6, bg-gold text-bark
    "Add to Cart — ৳499"
    (disabled if campaign status is 'inactive')
  ```
  **Campaign Details Section**
  ```
  bg-white, padding 40px 24px, grid 2-col desktop / 1-col mobile, gap-8

  Left column:
    Box image placeholder (aspect 1:1, 300px, bg-bark-mid)
    Caption below: "Hand-packed. Every box is different."

  Right column:
    Heading: font-display 1.8rem "What's Inside?"
    Bullet list (DM Sans):
      • 2–3 handcrafted pieces
      • Surprise combinations you won't find in the shop
      • Branded unboxing experience
      • ৳200 coupon for your next order (expires 30 days)
      • Free delivery within Dhaka

    Price card: mt-8, bg-ivory-warm, border border-border, p-4
      "Mystery Price" — font-display 2.2rem text-gold "৳499"
      "Delivery" — font-body text-sm text-bark-muted "৳60 (Dhaka) / ৳120 (Outside)"
      Total: "৳559 — ৳619"

    Terms: DM Sans 11px text-bark-muted mt-4
      "No returns on mystery boxes. All sales final. 
       Coupon code sent via SMS/email after delivery."
  ```
  **Add to Cart Button Behavior**
  ```
  If campaign is 'active':
    Button is enabled, click opens CartDrawer with mystery box as pre-added item
    Item in cart shows: "Mystery Collection | ৳499" + thumbnail (gold gradient)
    
  If campaign is 'inactive':
    Button is disabled (grayed out)
    Hover tooltip: "This collection is not available yet. Check back soon."
    
  If campaign is 'completed':
    Button is disabled
    Copy: "Sold out. Thank you!"
  ```
  "" you can override mystery collection design system with your own  
  -- Mystery box campaign config
  CREATE TABLE mystery_box_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- "Summer Clearance Mystery"
    price INTEGER NOT NULL, -- 499
    coupon_code TEXT NOT NULL, -- "MYSTERY499"
    coupon_amount INTEGER NOT NULL, -- 200 (in BDT)
    coupon_expires_days INTEGER DEFAULT 30,
    description TEXT,
    status TEXT DEFAULT 'inactive', -- 'inactive', 'active', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  -- Products tagged for mystery inclusion
  CREATE TABLE mystery_box_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES mystery_box_campaigns(id),
    product_id UUID REFERENCES products(id),
    is_packed BOOLEAN DEFAULT false, -- true after packed into a box
    packed_into_order_id UUID, -- links to which order this item was packed in
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  -- Mystery box orders
  CREATE TABLE mystery_box_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES mystery_box_campaigns(id),
    order_number TEXT UNIQUE NOT NULL, -- "MYST-20250421-001"
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    upazila TEXT NOT NULL,
    delivery_charge INTEGER DEFAULT 60,
    total INTEGER NOT NULL, -- 499 + 60
    status TEXT DEFAULT 'pending', -- 'pending', 'packed', 'shipped', 'delivered'
    tracking_number TEXT, -- Steadfast tracking
    coupon_code TEXT,
    items_packed JSONB, -- [{product_id, name, price}, ...] — logged after packing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
  );
7. &nbsp;