import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroImage = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.34%20AM%20(1).jpeg';

const HeroSection = () => (
  <section className="relative w-full min-h-[75vh] md:min-h-[90vh] overflow-hidden">
    {/* Background Image */}
    <motion.img
      initial={{ scale: 1.06, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      src={heroImage}
      alt="Nore'e editorial — South Asian woman wearing gold jewelry in golden hour"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/45 z-[1]" />

    {/* Content */}
    <div className="relative z-[2] flex flex-col items-center justify-center text-center min-h-[75vh] md:min-h-[90vh] px-6 py-20 md:px-12 md:py-32">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-[11px] uppercase tracking-[0.18em] text-white/70 mb-4"
      >
        New Collection · 2025
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
        className="font-body font-light text-sm md:text-base text-white/80 max-w-[320px] md:max-w-[380px] leading-relaxed mt-4 mx-auto"
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
          className="inline-block w-full max-w-[280px] md:w-auto bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] px-8 md:px-10 py-4 rounded-[2px] hover:bg-gold-dark transition-colors duration-200 active:scale-[0.97] text-center"
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
    </div>
  </section>
);

export default HeroSection;
