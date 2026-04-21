import { Link } from 'react-router-dom';
import editorialImg from '@/assets/editorial-phone-charms.jpg';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const EditorialBanner = () => (
  <section className="relative bg-noir overflow-hidden">
    {/* Decorative numeral */}
    <span className="absolute top-6 right-8 numeral text-ivory/8 select-none pointer-events-none hidden md:block" style={{ fontSize: '12rem', opacity: 0.06 }}>02</span>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] md:min-h-[600px] max-w-[1400px] mx-auto"
    >
      {/* Content */}
      <div className="md:col-span-5 md:col-start-2 px-6 py-14 md:px-0 md:py-24 flex flex-col justify-center order-2 md:order-1 relative z-[1]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <span className="numeral text-gold text-2xl">02</span>
          <span className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
            Phone Charms · Spotlight
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light text-ivory mt-6 leading-[1.05]"
          style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}
        >
          Carry something
          <br />
          <span className="italic text-gold">unmistakably yours.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-body font-light text-ivory/70 mt-6 leading-relaxed max-w-[420px]"
        >
          Our candy bead and stone chip phone straps are designed for the girl who decorates everything she loves — small heirlooms for daily life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 flex items-center gap-6"
        >
          <Link
            to="/category/phone-charms"
            className="group inline-flex items-center gap-2 border border-gold text-gold font-body text-[12px] uppercase tracking-[0.18em] px-7 py-3.5 rounded-[2px] hover:bg-gold hover:text-bark transition-all duration-300 active:scale-[0.97]"
          >
            Shop Phone Charms
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="hidden md:inline font-body text-xs text-ivory/40 tracking-wide">12 pieces · from ৳349</span>
        </motion.div>
      </div>

      {/* Image */}
      <div className="md:col-span-6 md:col-start-7 relative h-[320px] md:h-auto order-1 md:order-2 overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={editorialImg}
          alt="Nore'e candy bead phone charms collection"
          className="w-full h-full object-cover"
        />
        {/* Frame inset */}
        <div className="absolute inset-5 md:inset-8 border border-gold/30 pointer-events-none" />
        {/* Caption corner */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <span className="font-body text-[10px] text-ivory uppercase tracking-[0.28em] block">Nore'e Candy Co.</span>
          <span className="font-display italic text-ivory/80 text-sm mt-1 block">Featured · Vol. 02</span>
        </div>
      </div>
    </motion.div>
  </section>
);

export default EditorialBanner;
