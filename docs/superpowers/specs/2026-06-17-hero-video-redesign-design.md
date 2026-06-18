# Hero Redesign — Full-Bleed Cinematic, Video-Ready (Mobile-First)

**Date:** 2026-06-17
**Component:** `src/components/home/HeroSection.tsx` (full rewrite)
**Status:** Implemented (build green; verified mobile + desktop).

## Revision (2026-06-17, as built)

The brief changed during build: **no on-model still** — the client wants a
**branded placeholder** that they will replace with a **landscape (16:9) products
video**. Final behaviour:

- **Media slot** shows a branded placeholder until `HERO_VIDEO` is set: deep warm
  bark→espresso gradient + breathing gold/crimson spotlight + a pulsing gold play
  ring and `The Collection · In Motion` caption. Reads as an intentional "film about
  to start," not a broken image.
- **Mobile:** the landscape video sits in a **contained 16:9 band** (no cropping —
  products never cut off); headline + CTA sit below on the dark backdrop.
- **Desktop:** the video is **full-bleed cover**; text overlays bottom-left on a scrim.
- To go live, fill the `HERO_VIDEO` constant (`mp4`, optional `webm`, optional
  `poster`) — the video plays in the exact slot, no other change.
- Also done: **page scrollbar hidden on all viewports** (`html/body`, scrolling still
  works) in `src/index.css`.

The original "art-directed on-model still" plan below is superseded by the above.

## Goal

Replace the 50/50 editorial split + italic marquee hero (which the client disliked)
with a single **full-bleed cinematic hero**, designed phone-first, that *showcases*
the product. Built as a real video player but renders an art-directed still today,
so it looks finished now and upgrades to video with no layout change.

## Context / constraints (load-bearing)

- **65%+ of jewellery browsing is mobile** → design phone-first, not desktop-scaled.
- **No real product video exists yet.** Chosen path: *video-ready* hero with a
  poster-only graceful fallback (looks like a polished still hero today).
- Autoplay requires `muted` + `loop` + `playsInline` (without `playsInline`,
  iOS Safari forces fullscreen and breaks autoplay).
- Poster/still is the **LCP element** — must paint instantly (`fetchpriority="high"`).
- Respect `prefers-reduced-motion` and Save-Data / iOS Low-Power → keep the still,
  never attach video.
- Prior hard constraint: hero still must **not** Ken-Burns/zoom (upscaled photos
  pixelate). Motion, when it comes, comes from real footage.

## Assets (already in `src/assets/`)

- `hero-mobile.jpg` — **portrait** on-model: cream silk saree, gold jhumka + layered
  necklaces + bangles, warm tree-bark backdrop, dark edges. → mobile still.
- `hero-desktop.jpg` — **landscape** version of the same look. → desktop still.
- Dark bark edges + bottom scrim guarantee legibility of overlaid light text.
- These on-model "worn" images match the *"Worn, not just owned."* concept far better
  than the current product-only driftwood still (`hero-editorial-v2.jpg`).

## Layout

**Full-bleed cinematic.** Hero sits below the existing sticky translucent
`NavigationBar` (nav unchanged — no nav inside hero).

- Media layer fills the section (`object-cover`):
  - **Art-directed `<picture>`**: `hero-mobile.jpg` (`<768px`, portrait) /
    `hero-desktop.jpg` (`≥768px`, landscape). This is the permanent poster/fallback.
  - **Video layer** (rendered only when `HERO_VIDEO !== null` and motion allowed):
    `<video autoPlay muted loop playsInline preload="metadata">` layered over the
    `<picture>`, covering it once playing. `null` today.
- Height: `min-h-[82svh] md:min-h-[86vh]` (svh avoids the iOS URL-bar jump; leaves a
  small peek of the next section to invite scroll).
- **Bottom gradient scrim** (`from-bark/75 via-bark/25 to-transparent`) anchoring text.
- Text cluster, bottom-left, light (`ivory`):
  - Eyebrow: gold hairline + `THE HEIRLOOM EDIT · NO 01` (caps, tracked).
  - Headline: `Worn, not just owned.` (Cormorant Garamond, italic display).
  - Sub-line: `Hand-finished heirloom jewellery, made in Dhaka.`
  - Primary CTA (solid): **See the Collection** → `/shop`.
  - Secondary (text link): *Build your own box* → `/mystery-collection/build`.
- Desktop anchors the cluster lower-left with more breathing room; headline scales up.

## Motion

- Image is **static** (fade-in only, no zoom) — honors the no-Ken-Burns constraint.
- Text: staggered blur/rise-in via framer-motion (matches existing site motion).
- When `HERO_VIDEO` is set, motion comes from the footage.

## Performance & accessibility

- Poster/still `loading="eager"` + `fetchpriority="high"` → fast LCP.
- Video (future): `playsInline muted loop`, attached after first paint, lighter mobile
  clip vs desktop. Gated by `prefers-reduced-motion` and `navigator.connection.saveData`.
- Scrim ensures WCAG-adequate contrast for overlaid text.

## Other changes

- **Remove** the italic marquee (client disliked it).
- Add a **mobile-only** (`md:hidden`) slim trust line under the media
  (`Hand-finished in Dhaka · Cash on delivery · 3-day exchange`), because the global
  `TrustBar` is `hidden md:block` (desktop-only) — phones would otherwise lose the
  trust signal.

## Files touched

- Rewrite: `src/components/home/HeroSection.tsx`.
- No token or config changes (`tailwind.config.ts` already has needed keyframes).
- `Index.tsx` unchanged (hero mounts the same).

## To upgrade to video later

1. Add `hero.mp4` / `hero.webm` (+ a lighter `hero-mobile.mp4`) to `src/assets/`.
2. Set the `HERO_VIDEO` constant in `HeroSection.tsx` to those imports.
3. Done — picture becomes the poster, video plays over it.
