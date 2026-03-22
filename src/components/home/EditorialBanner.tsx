import { Link } from 'react-router-dom';
import editorialImg from '@/assets/editorial-phone-charms.jpg';
import { motion } from 'framer-motion';

const EditorialBanner = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7 }}
    className="grid grid-cols-1 md:grid-cols-2 min-h-[320px] md:min-h-[480px]"
  >
    {/* Content */}
    <div className="bg-bark px-6 py-10 md:px-16 md:py-20 flex flex-col justify-center order-2 md:order-1">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-body text-[11px] uppercase tracking-[0.18em] text-gold"
      >
        Phone Charms · New In
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-display italic font-light text-ivory mt-4"
        style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
      >
        Carry something beautiful.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="font-body font-light text-bark-muted mt-4 leading-relaxed max-w-[380px]"
      >
        Our candy bead and stone chip phone straps are designed for the girl who decorates everything she loves.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.65, duration: 0.5 }}
      >
        <Link
          to="/category/phone-charms"
          className="inline-block mt-8 border border-gold text-gold font-body text-sm uppercase tracking-[0.1em] px-6 py-3 rounded-[2px] hover:bg-gold hover:text-bark transition-colors duration-200 active:scale-[0.97]"
        >
          Shop Phone Charms →
        </Link>
      </motion.div>
    </div>

    {/* Image */}
    <div className="relative h-[220px] md:h-auto order-1 md:order-2 overflow-hidden">
      <img
        src={editorialImg}
        alt="Nore'e candy bead phone charms collection"
        className="w-full h-full object-cover"
      />
      <span className="absolute bottom-4 left-4 font-body text-[11px] text-ivory uppercase tracking-wider">
        Nore'e Candy Collection
      </span>
    </div>
  </motion.section>
);

export default EditorialBanner;
