import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';

const heroImageDesktop = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.34%20AM%20(1).jpeg';
const heroImageMobile = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.35%20AM%20(1).jpeg';

const HeroSection = () => (
  <section className="relative w-full min-h-[78vh] md:min-h-[92vh] overflow-hidden bg-bark">
    {/* Backgrounds */}
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      src={heroImageDesktop}
      alt="Nore'e editorial — South Asian woman wearing gold jewelry in golden hour"
      className="hidden md:block absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
    />
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      src={heroImageMobile}
      alt="Nore'e editorial — South Asian woman wearing gold jewelry"
      className="block md:hidden absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
    />

    {/* Editorial overlay — directional + vignette */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10 z-[1]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15 z-[1]" />

    {/* Vertical brand mark — desktop */}
    <div className="hidden md:flex absolute left-6 top-0 bottom-0 z-[3] flex-col items-center justify-between py-8 text-ivory/60">
      <span className="vertical-text font-body text-[10px] tracking-[0.4em] uppercase">Nore'e — Est. 2024</span>
      <div className="w-px h-24 bg-ivory/30" />
      <span className="vertical-text font-body text-[10px] tracking-[0.4em] uppercase">Volume 01 · SS25</span>
    </div>

    {/* Frame inset (luxury magazine feel) */}
    <div className="hidden md:block absolute inset-6 border border-ivory/15 pointer-events-none z-[2]" />

    {/* Content — left-aligned editorial on desktop, centered on mobile */}
    <div className="relative z-[3] flex flex-col justify-end md:justify-center min-h-[78vh] md:min-h-[92vh] px-6 pb-14 md:pb-0 md:pl-24 md:pr-12 md:max-w-[920px]">
      <div className="text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 justify-center md:justify-start mb-5"
        >
          <span className="block w-8 md:w-12 h-px bg-gold" />
          <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gold">
            The Heirloom Edit · 2025
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light text-ivory leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 6.5rem)' }}
        >
          Adorned in
          <br />
          <span className="italic text-gold">quiet luxury.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-body font-light text-base md:text-lg text-ivory/85 max-w-[340px] md:max-w-[440px] leading-relaxed mt-6 mx-auto md:mx-0"
        >
          Heirloom-inspired pieces, hand-finished in small batches for the woman who collects beauty.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 justify-center md:justify-start"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center justify-center w-full md:w-auto max-w-[280px] md:max-w-none bg-gold text-bark font-body font-medium text-[13px] uppercase tracking-[0.18em] px-9 py-4 rounded-[2px] hover:-translate-y-px transition-all duration-300 active:scale-[0.97] overflow-hidden"
          >
            <span className="relative z-[1]">Shop the Edit</span>
            <span className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-0" />
          </Link>
          <Link
            to="/category/new-arrivals"
            className="font-body text-sm text-ivory/80 hover:text-gold tracking-wide link-reveal"
          >
            Discover New Arrivals
          </Link>
        </motion.div>

        {/* Trust micro-row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex items-center gap-4 md:gap-6 text-ivory/70 font-body text-[11px] md:text-xs flex-wrap justify-center md:justify-start"
        >
          <span className="inline-flex items-center gap-1.5">
            <Star size={12} className="fill-gold text-gold" />
            <span className="tracking-wide">4.9 / 5</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-ivory/30" />
          <span className="tracking-wide">2,400+ orders shipped</span>
          <span className="hidden md:inline w-1 h-1 rounded-full bg-ivory/30" />
          <span className="hidden md:inline tracking-wide">Cash on delivery, nationwide</span>
        </motion.div>
      </div>
    </div>

    {/* Scroll cue */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 6, 0] }}
      transition={{ delay: 1.5, opacity: { duration: 0.8 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
      className="hidden md:flex absolute bottom-8 right-10 z-[3] text-ivory/60 flex-col items-center gap-1.5"
    >
      <span className="font-body text-[10px] uppercase tracking-[0.3em]">Scroll</span>
      <ChevronDown size={14} />
    </motion.div>
  </section>
);

export default HeroSection;
