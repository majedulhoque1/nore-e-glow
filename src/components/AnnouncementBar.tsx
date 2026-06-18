import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
  'Complimentary cash-on-delivery, nationwide',
  'Order in seconds via WhatsApp',
];

const AnnouncementBar = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-noir text-ivory h-9 flex items-center justify-center overflow-hidden relative border-b border-gold/20">
      <div className="absolute inset-0 bg-gold-sheen opacity-[0.04]" />
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-body whitespace-nowrap text-[9.5px] tracking-[0.12em] sm:text-[10.5px] sm:tracking-[0.22em] uppercase text-ivory/90 relative z-[1] flex items-center gap-2 sm:gap-3"
        >
          <span className="text-gold text-[10px] sm:text-xs">✦</span>
          {messages[idx]}
          <span className="text-gold text-[10px] sm:text-xs">✦</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBar;
