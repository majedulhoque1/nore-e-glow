import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
    <section className="relative bg-blush-warm border-y border-gold/15 py-20 md:py-32 px-6 overflow-hidden texture-grain">
      {/* Decorative quote mark */}
      <Quote className="absolute top-10 left-10 md:top-16 md:left-20 text-gold/15" size={80} />
      <Quote className="absolute bottom-10 right-10 md:bottom-16 md:right-20 text-gold/15 rotate-180" size={80} />

      <div className="max-w-[820px] mx-auto text-center relative z-[1]">
        <div className="flex items-center justify-center gap-3">
          <span className="block w-10 h-px bg-gold" />
          <span className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
            Our Customers
          </span>
          <span className="block w-10 h-px bg-gold" />
        </div>
        <p className="font-display italic font-light text-bark-mid mt-4 text-sm">
          Loved by 2,400+ women across Bangladesh
        </p>
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className="fill-gold text-gold" />
          ))}
        </div>

        <div className="mt-12 min-h-[200px] md:min-h-[180px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display italic font-light text-bark leading-[1.25]" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)' }}>
                &ldquo;{quotes[idx].text}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gold/60" />
                <p className="font-body text-xs uppercase tracking-[0.22em] text-bark">
                  {quotes[idx].name}
                </p>
                <span className="font-body text-xs text-bark-muted">·</span>
                <p className="font-body text-xs text-bark-mid italic">{quotes[idx].city}</p>
                <div className="w-8 h-px bg-gold/60" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${i === idx ? 'w-10 bg-gold' : 'w-1 bg-bark-muted/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
