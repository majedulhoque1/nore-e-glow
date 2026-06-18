import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * ▶ DROP YOUR PRODUCT FILM HERE (two orientations).
 *
 * Until then, the hero is a self-sufficient "gallery-light" title card — a finished
 * 10/10 frame on its own, NOT a "video coming soon" placeholder.
 *
 * To go live, provide a PORTRAIT clip for phones and a LANDSCAPE clip for desktop —
 * each fills its screen full-bleed with no cropping:
 *   import heroMobile from '@/assets/hero-portrait.mp4';   // 9:16
 *   import heroDesktop from '@/assets/hero-landscape.mp4'; // 16:9
 *   const HERO_VIDEO: HeroVideo = {
 *     mobile:  { mp4: heroMobile },
 *     desktop: { mp4: heroDesktop },
 *     poster: heroPoster,   // optional first-frame still
 *   };
 */
type HeroSource = { mp4: string; webm?: string };
type HeroVideo = { mobile: HeroSource; desktop: HeroSource; poster?: string };
const HERO_VIDEO: HeroVideo | null = null;

const EASE = [0.16, 1, 0.3, 1] as const;

const HeroSection = () => {
  const reduce = useReducedMotion();
  const [playVideo, setPlayVideo] = useState(false);
  useEffect(() => {
    if (!HERO_VIDEO) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!reduceMotion && connection?.saveData !== true) setPlayVideo(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-bark min-h-[calc(100svh-5.75rem)] md:min-h-[92vh]">
      {/* ── ATMOSPHERE: the "gallery light" ground (always behind any video) ── */}
      <div className="absolute inset-0">
        {/* warm base */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(158deg, #2c1e18 0%, #1c1917 52%, #100b09 100%)' }}
        />
        {/* off-centre breathing gold light shaft — desktop (the single hero gesture) */}
        <motion.div
          aria-hidden
          className="hidden md:block absolute inset-0"
          style={{
            background:
              'radial-gradient(46% 72% at 36% 30%, rgba(201,160,82,0.22), rgba(201,160,82,0.06) 38%, transparent 64%)',
          }}
          animate={reduce ? undefined : { opacity: [0.6, 0.85, 0.6], x: ['0%', '-3%', '0%'] }}
          transition={reduce ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* breathing light — mobile: a single shaft falling into the upper-centre void */}
        <motion.div
          aria-hidden
          className="md:hidden absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 46% at 50% 24%, rgba(201,160,82,0.26), rgba(201,160,82,0.08) 44%, transparent 72%)',
          }}
          animate={reduce ? undefined : { opacity: [0.62, 0.95, 0.62] }}
          transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* one crimson ember, far corner */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(34% 50% at 88% 84%, rgba(139,26,42,0.16), transparent 60%)' }}
        />
        {/* film grain — the detail that reads as "expensive" */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
          <filter id="heroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>
        {/* vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.6) 100%)' }}
        />
      </div>

      {/* ── VIDEO (when provided): portrait fills phones, landscape fills desktop — both full-bleed, no crop ── */}
      {HERO_VIDEO && playVideo && (
        <>
          <video
            className="md:hidden absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO.poster}
          >
            {HERO_VIDEO.mobile.webm && <source src={HERO_VIDEO.mobile.webm} type="video/webm" />}
            <source src={HERO_VIDEO.mobile.mp4} type="video/mp4" />
          </video>
          <video
            className="hidden md:block absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO.poster}
          >
            {HERO_VIDEO.desktop.webm && <source src={HERO_VIDEO.desktop.webm} type="video/webm" />}
            <source src={HERO_VIDEO.desktop.mp4} type="video/mp4" />
          </video>
        </>
      )}

      {/* ── bottom scrim for text legibility (both breakpoints) ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(28,25,23,0.9) 0%, rgba(28,25,23,0.4) 30%, transparent 58%)',
        }}
      />

      {/* ── editorial corner mark (desktop) ── */}
      <div className="hidden md:block absolute top-8 right-10 font-body text-[10px] uppercase tracking-[0.3em] text-ivory/35">
        Still life · Nº 01
      </div>

      {/* ── editorial mark (mobile): a vertical signature anchoring the upper-right void ── */}
      <div
        aria-hidden
        className="md:hidden absolute top-7 right-4 flex flex-col items-center gap-3 text-ivory/30"
      >
        <span className="w-1.5 h-1.5 bg-gold/70 rotate-45" />
        <span className="vertical-text font-body text-[9px] uppercase tracking-[0.35em] leading-none">
          Still life · Nº 01
        </span>
        <span className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>

      {/* ── CONTENT: overlaid, bottom-left ── */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-[calc(2.75rem+env(safe-area-inset-bottom))] md:pb-16 lg:pb-20">
          <div className="max-w-[660px]">
            {/* eyebrow — gold hairline + one crimson ember */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="flex items-center gap-3 font-body text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-ivory/70"
            >
              <span className="w-1.5 h-1.5 bg-crimson rotate-45" />
              <span className="w-7 h-px bg-gold" />
              <span>The Heirloom Edit — No 01</span>
            </motion.div>

            {/* headline — roman + gold italic emphasis */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
              className="mt-6 font-display text-ivory leading-[0.9] tracking-[-0.02em] text-[clamp(3rem,12vw,7rem)]"
            >
              Worn into<br />
              <span className="italic text-gold-light">memory.</span>
            </motion.h1>

            {/* sub-line */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
              className="mt-6 font-body text-[14px] md:text-[15px] tracking-wide text-ivory/80 max-w-[44ch]"
            >
              Hand-finished in Dhaka, made to be passed down.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58, ease: EASE }}
              className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7"
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-ivory text-bark font-body text-[12px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold transition-colors duration-300"
              >
                <span>Explore the Collection</span>
                <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/mystery-collection/build"
                className="inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.2em] text-ivory/85 hover:text-gold transition-colors"
              >
                <span className="text-gold">✦</span>
                Build your box
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
