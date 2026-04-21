import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';

const heroImageDesktop = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.34%20AM%20(1).jpeg';
const heroImageMobile = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.35%20AM%20(1).jpeg';

const HeroSection = () => (
  <section className="relative w-full min-h-[75vh] md:min-h-[90vh] overflow-hidden">
    {/* Desktop Background — Ken Burns */}
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      src={heroImageDesktop}
      alt="Nore'e editorial — South Asian woman wearing gold jewelry in golden hour"
      className="hidden md:block absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
    />
    {/* Mobile Background — Ken Burns */}
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      src={heroImageMobile}
      alt="Nore'e editorial — South Asian woman wearing gold jewelry"
      className="block md:hidden absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
    />

    {/* Editorial gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-[1]" />

    {/* Content */}
    <div className="relative z-[2] flex flex-col items-center justify-center text-center min-h-[75vh] md:min-h-[90vh] px-6 py-20 md:px-12 md:py-32">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-[11px] uppercase tracking-[0.18em] text-gold mb-4 inline-flex items-center gap-2"
      >
        New Collection · 2025
        <span className="block w-10 h-px bg-gold/60" />
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display italic font-light leading-[1.05] text-white max-w-[700px]"
        style={{ fontSize: 'clamp(2.2rem, 8vw, 5.5rem)' }}
      >
        Adorn yourself,<br />
        <span className="text-gold">beautifully.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-body font-light text-sm md:text-base text-white/85 max-w-[320px] md:max-w-[420px] leading-relaxed mt-4 mx-auto"
      >
        Handcrafted jewelry for the woman who adorns every moment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex flex-col items-center"
      >
        <Link
          to="/shop"
          className="inline-block w-full max-w-[280px] md:w-auto bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] px-8 md:px-10 py-4 rounded-[2px] hover:bg-gold-dark hover:-translate-y-px transition-all duration-200 active:scale-[0.97] text-center"
        >
          Shop Collection →
        </Link>
        <Link
          to="/category/new-arrivals"
          className="mt-4 font-body text-sm text-white/70 hover:text-gold hover:underline underline-offset-4 transition-colors"
        >
          View New Arrivals
        </Link>
      </motion.div>

      {/* Trust micro-row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-8 flex items-center gap-3 md:gap-5 text-white/75 font-body text-[11px] md:text-xs flex-wrap justify-center"
      >
        <span className="inline-flex items-center gap-1">
          <Star size={12} className="fill-gold text-gold" /> 4.9
        </span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>2,400+ orders</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>Free COD</span>
      </motion.div>
    </div>

    {/* Scroll cue */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 6, 0] }}
      transition={{ delay: 1.5, opacity: { duration: 0.8 }, y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
      className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] text-white/60 flex-col items-center gap-1"
    >
      <span className="font-body text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      <ChevronDown size={16} />
    </motion.div>
  </section>
);

export default HeroSection;
