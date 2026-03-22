import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroImage = 'https://lqxjwbzmsathjsulcnth.supabase.co/storage/v1/object/public/product-images/WhatsApp%20Image%202026-03-07%20at%202.32.34%20AM%20(1).jpeg';

const HeroSection = () => (
  <section className="grid grid-cols-1 md:grid-cols-[55fr_45fr] min-h-[90vh]">
    {/* Image Column */}
    <div className="relative h-[65vw] md:h-auto overflow-hidden">
      <motion.img
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        src={heroImage}
        alt="Nore'e editorial — South Asian woman wearing gold jewelry in golden hour"
        className="w-full h-full object-cover"
      />
      <span className="absolute bottom-4 left-4 font-body text-[11px] text-ivory uppercase tracking-widest">
        Handcrafted in Dhaka
      </span>
    </div>

    {/* Content Column */}
    <div className="flex flex-col justify-center px-6 py-8 md:px-20 text-center md:text-left">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-[11px] uppercase tracking-[0.18em] text-bark-muted"
      >
        New Collection · 2025
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display italic font-light mt-4 leading-[1.05]"
        style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
      >
        Adorn yourself,<br />
        <span className="text-gold">beautifully.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-body font-light text-base text-bark-mid max-w-[340px] leading-relaxed mt-5 mx-auto md:mx-0"
      >
        Handcrafted jewelry for the woman who adorns every moment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex flex-col items-center md:items-start"
      >
        <Link
          to="/shop"
          className="inline-block bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] px-8 py-4 rounded-[2px] hover:bg-gold-dark transition-colors duration-200 active:scale-[0.97]"
        >
          Shop Collection →
        </Link>
        <Link
          to="/category/new-arrivals"
          className="mt-3 font-body text-sm text-gold underline-offset-4 hover:underline"
        >
          View New Arrivals
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
