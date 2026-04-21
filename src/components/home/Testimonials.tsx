import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const quotes = [
  {
    text: 'The packaging alone made me gasp. The bracelet is even more beautiful in person — I get compliments every day.',
    name: 'Tasnia R.',
    city: 'Dhaka',
  },
  {
    text: 'Ordered the candy phone strap and it arrived in two days, perfectly packed. Already came back for more.',
    name: 'Maliha A.',
    city: 'Chattogram',
  },
  {
    text: 'I bought the kundan set for my engagement and it looked like real heirloom jewelry. Worth every taka.',
    name: 'Sumaiya K.',
    city: 'Sylhet',
  },
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="bg-ivory-warm border-y border-border py-16 md:py-24 px-6"
    >
      <div className="max-w-[760px] mx-auto text-center">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">
          Loved by 2,400+ customers
        </span>
        <div className="flex justify-center mt-3 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className="fill-gold text-gold" />
          ))}
        </div>

        <div className="mt-8 min-h-[180px] md:min-h-[160px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display italic font-light text-bark leading-snug" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.75rem)' }}>
                &ldquo;{quotes[idx].text}&rdquo;
              </blockquote>
              <p className="font-body text-sm text-bark-mid mt-5">
                — {quotes[idx].name}, <span className="text-bark-muted">{quotes[idx].city}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-gold' : 'w-1.5 bg-bark-muted/30'}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
