## Refine the header into a simple, classic editorial UI

The current header has three stacked rows (announcement bar + utility row + main row) and mixes a pill-shaped accent button, a search field, three icons, and asymmetric nav clusters. It feels busy. The plan below tightens it into a calm, classic e-commerce header inspired by editorial jewellery houses (Tiffany, Mejuri, Missoma): centered wordmark, balanced nav on either side, icon-only utilities, and a single slim promo strip.

### Visual goals

- Quiet, symmetrical, generous whitespace
- One promo strip (not two)
- Centered wordmark as the anchor
- Icon-only right cluster, no inline search field
- Subtle gold accent reserved for the active link underline and cart badge only
- Mobile: clean three-column bar with a refined slide-in drawer

### Layout (desktop ≥ md)

```text
┌───────────────────────────────────────────────────────────────────┐
│  ✦  Complimentary cash-on-delivery, nationwide   ✦   (rotating)   │  ← single bark strip, h-9
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Shop   Rings   Bracelets   New        NORE'E        ⌕  ♡  ⌂  ⛯  │  ← h-20
│                                  (centered wordmark)              │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│   ─────────── hairline gold rule ───────────                      │
└───────────────────────────────────────────────────────────────────┘
```

- Replace the dark utility row + announcement bar with a single slim bark strip (keeps the rotating messages, drops Track Order/FAQ/WhatsApp links — those live in the footer already).
- Main row height 80px, ivory/70 + backdrop blur (kept), bottom border swapped for the existing `.rule-gold` hairline for a couture feel.
- Left nav: Shop · Rings · Bracelets · New Arrivals — uppercase, tracking-[0.18em], 11.5px, bark-mid, gold on hover, gold underline when active.
- "Build Your Box" demoted from a colored pill to a regular nav item with a small ✦ glyph prefix so the bar reads evenly. Keeps discoverability without the loud button.
- Center: wordmark only (no logo mark on desktop) in Cormorant Garamond, 28px, tracking-tight. Click → home.
- Right: four icon buttons at 18px, 20px gaps — Search (opens modal), Wishlist, Account-placeholder removed, Cart with gold dot badge (no number circle until count >0; then tiny gold pill).
- Remove the inline search input entirely — the search modal (already keyboard-shortcut enabled) is the single search entry point. Cleaner, more classic.

### Layout (mobile <md)

```text
┌──────────────────────────────────────────┐
│  ✦  Free delivery in Dhaka  ✦            │  promo strip
├──────────────────────────────────────────┤
│  ☰          NORE'E              ⌕   ⛯    │  h-14
├──────────────────────────────────────────┤
```

- Three-column grid so the wordmark is perfectly centered regardless of icon count.
- Drawer redesign: ivory background (not dark bark) for consistency with the classic feel; large serif links; small uppercase section labels ("Shop", "Discover"); Build Your Box listed under Discover with the ✦ glyph; close affordance top-right; subtle gold hairline dividers.

### Behavioral details

- Sticky header keeps backdrop blur.
- Active link: gold underline (1px, full link width) — already partially implemented; standardize with `link-reveal` style.
- Cart badge: shows only when totalItems > 0; small gold circle, white numerals, `-top-1 -right-2`.
- Mini-cart hover preview kept as-is.
- Cmd/Ctrl+K to open search kept.

### Files to edit

- `src/components/NavigationBar.tsx` — full rewrite of the header markup per layouts above.
- `src/components/AnnouncementBar.tsx` — keep messages, no structural change (still rendered above the header in `App.tsx`); confirm only one promo bar shows by removing the duplicate utility row from NavigationBar.

### Out of scope

- No new routes, no new icons added, no logo asset changes.
- Footer, hero, and downstream pages untouched.  
Can you do something with hero image placeholder and image as well?  
i dont like the hero section t all
- &nbsp;