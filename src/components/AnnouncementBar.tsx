import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
  'Free COD across Bangladesh',
  'Easy 3-day exchange',
  'Order on WhatsApp',
];

const AnnouncementBar = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-bark text-ivory h-8 flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-[11px] tracking-[0.12em] uppercase text-ivory/90"
        >
          <span className="text-gold">✦</span>{' '}
          {messages[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBar;
