# Nore'e Homepage Redesign — Header, Hero & Featured Video

**Date:** 2026-06-13
**Status:** Approved direction, ready for implementation planning
**Scope:** Homepage top-of-page (`src/pages/Index.tsx`) — announcement bar, navigation, hero, featured products, and a NEW 16:9 featured-video section. Other pages untouched.

---

## 1. Background & Goal

The current homepage hero (`HeroSection.tsx`) is a 50/50 editorial split (headline panel + product-on-driftwood photo) with an italic scrolling marquee. The client dislikes the overall first impression and wants:

1. A redesigned header/hero that feels premium and distinctive.
2. A **featured 16:9 video** section (new requirement).

After exploring six directions at real scale, the chosen direction is **"Worn"** — warm, lifestyle-led minimalism. It wins by doing less: one large, high-quality hero photograph, generous negative space, a refined minimal nav, and one quiet line of copy. This matches the formula used by best-in-class jewellery brands (Mejuri, Missoma, Aurate) and — critically — fits Nore'e's **actual photography**, which is warm, sunlit, crimson-silk-and-gold (not cool studio minimalism).

**Success criteria:** the homepage reads as premium and intentional within the first screen; the hero is razor-sharp on 4K displays; the featured video has a clear, calm home; and nothing regresses on mobile or page-load performance.

---

## 2. Chosen Aesthetic — "Worn"

- **Palette (existing brand tokens, unchanged):** ivory `#FAF5EB`, warm paper `#F3E9D6`, bark `#1C1917`, gold `#C9A052` / gold-dark `#9A7A30`, noir `#14110f`, crimson `#8B1A2A`.
- **Type (existing):** Cormorant Garamond (display), DM Sans (body).
- **Principle:** restraint and photography carry the luxury, not decoration. Remove the pale italic marquee. Let one strong image own the first screen.

---

## 3. Section-by-Section Design

### 3.1 Announcement bar — UNCHANGED
Keep `AnnouncementBar.tsx` as-is (rotating noir bar with gold ✦ accents).

### 3.2 Navigation — light refinement, not a rewrite
Keep `NavigationBar.tsx`'s structure (3-column grid: links / centered wordmark / icons; sticky; mobile drawer). The "Worn" hero is light at the top, so the existing ivory translucent nav sits fine above it. No structural change required. Optional polish only: confirm spacing/letter-spacing matches the new hero rhythm. **This component is essentially out of scope for redesign** — listed here to make explicit that it stays.

### 3.3 Hero — NEW (`HeroSection.tsx` rewritten)
- **Layout:** full-width single image, height `min(86vh, 820px)`. No split panel.
- **Image:** Nore'e's real "Pearl & Gold Hand Piece" photo (pearl strand on crimson silk), 4K-enhanced (see §4). `object-fit: cover`, `object-position: ~60% 42%` so the pearl loop stays in frame and the lower-left crimson area provides a dark bed for text.
- **Overlay copy (bottom-left panel, max-width ~520px):**
  - Kicker: `— The Heirloom Edit · Dhaka` (gold hairline + uppercase tracked label, ivory).
  - Headline (Cormorant, light, ~clamp(2.8rem, 5.6vw, 5rem), white, subtle text-shadow): **"Pearls & gold, _made to be kept._"** (copy final wording TBD with client; placeholder is good).
  - CTAs: solid ivory button **"Shop the Collection"** → `/shop`; text link **"✦ Build a Mystery Box"** → `/mystery-collection/build`.
- **Scrims:** a left-to-right and bottom-up dark gradient over the crimson so white text is always legible.
- **MOTION CONSTRAINT (explicit client requirement):** the hero image must **NOT** use a Ken Burns / scale-in zoom. It scales to its container at native size and never beyond, so the 4K image can never enlarge past its real resolution and pixelate. Allowed entrance motion: a gentle **opacity fade-in only** (~1.2s). Text/CTA may keep the existing staggered translate-up reveal.
- **Category quicklinks row** directly under the hero: 4 equal cells (Rings / Bracelets / Necklaces / ✦ Mystery Box) with a small italic numeral/glyph, hairline dividers, hover → warm paper bg + gold text. Gets users into product in one click. Links to existing category routes.

### 3.4 Featured products — `FeaturedProducts.tsx` restyled
- Keep the existing data source: `supabase.from('products').select('*').eq('is_featured', true).limit(8)`.
- Restyle to the airy "Worn" card: 4-up grid, `aspect-[4/5]` image, hairline-free, **"Quick add · ৳<price>"** bar that slides up on hover, Cormorant product name, price with optional `<s>compare_at_price</s>`.
- Keep the `SectionHeading` ("Bestsellers, handpicked.", rating, View All) — it already fits.
- **Image consistency note (not blocking):** current product photos have mixed backgrounds (crimson silk / white / one outdoor hand snap). The grid looks most "excellent" when backgrounds are consistent. Recommend (separate task) batch-normalizing product shots to a uniform warm/ivory backdrop. Out of scope for this redesign but flagged.

### 3.5 Featured video — NEW (`FeaturedVideo.tsx` new component)
- A calm 16:9 band on warm paper (`#F3E9D6`), placed in `Index.tsx` after `FeaturedProducts` (between products and the Build-Box promo).
- **Layout (desktop):** 2-column — left `~1.5fr` is the `aspect-[16/9]` video; right `~1fr` is copy ("The Film" eyebrow, Cormorant headline, one sentence, "Watch the film" button). Stacks to one column on mobile.
- **Playback:** `autoplay muted loop playsinline` for the inline ambient loop; a centered play button overlays to open sound/fullscreen.
- **GRACEFUL FALLBACK (required):** the client does not yet have the final video. The component must accept an optional video source. When no video is configured, it renders the **poster image only** (a product/lifestyle photo) with the play affordance hidden or pointing to a placeholder — the section must look intentional with zero video. Poster currently uses the Pearl-gajra product photo.
- **Source configuration:** there is no `site_settings` table. Follow the existing asset pattern — the video URL and poster are component props/constants for v1 (or a small hosted asset URL). A future admin-managed source is out of scope.

---

## 4. Hero Image Asset Pipeline

- **Source:** `Pearl & Gold Hand Piece` product image, originally a WhatsApp JPEG at 1164×1440 (already lossy).
- **Enhancement done:** denoise → Lanczos upscale to **4K (3104×3840)** → unsharp mask → subtle warm color/contrast lift. Result is crisp and premium for a hero background. Saved at `.superpowers/brainstorm/_heroimg/hero-4k.jpg` (~1 MB). NOTE: this is enhanced resolution, not AI-invented detail; the original full-res phone file would be superior if the client can supply it.
- **Production delivery (required for performance):** do NOT ship a single 1 MB JPEG. Generate **responsive WebP/AVIF** at ~1920w and ~3840w; serve via `<img srcset>`/`<picture>` so 4K screens get the sharp asset and phones get a small one. This preserves the "10/10 first impression" without hurting load.
- **Hosting:** upload final hero asset(s) to Supabase storage (e.g. a `site-assets` bucket) OR bundle under `src/assets/` like the current `hero-editorial-v2.jpg`. Bundling is simplest and matches the existing pattern; choose at implementation time.
- **Because the image is served at native size or smaller and never scaled up (see §3.3 motion constraint), it cannot pixelate.**

---

## 5. Components & Files Affected

| File | Change |
|------|--------|
| `src/components/home/HeroSection.tsx` | **Rewrite** — full-bleed image hero + bottom-left copy + category quicklinks; no-zoom motion. |
| `src/components/home/FeaturedProducts.tsx` | **Restyle** cards (quick-add, airy grid); data query unchanged. |
| `src/components/home/FeaturedVideo.tsx` | **New** — 16:9 band with graceful poster-only fallback. |
| `src/pages/Index.tsx` | Insert `<FeaturedVideo />` after `<FeaturedProducts />`. |
| `src/assets/` (or Supabase `site-assets`) | Add responsive hero asset(s). |
| `NavigationBar.tsx`, `AnnouncementBar.tsx` | **Unchanged** (explicitly kept). |

---

## 6. Out of Scope

- Redesigning nav/announcement bar beyond keeping them.
- Batch re-shooting / background-normalizing the product catalogue (flagged as a recommended follow-up).
- Admin UI for managing the hero image / video source.
- Pages other than the homepage.

---

## 7. Open Decisions (confirm before/within implementation)

1. **Final hero headline copy** — placeholder is "Pearls & gold, made to be kept." Client may want different wording.
2. **Video availability** — does the client have a real 16:9 film? If not, ship the poster-only fallback now and swap the source in later.
3. **Hero asset hosting** — bundle in `src/assets/` vs. Supabase `site-assets` bucket (lean: bundle).
4. **Which hero photo** — current pick is the pearl-on-crimson-plate shot; client may prefer the pearl-gajra cuff shot. Both are warm/crimson and fit.
