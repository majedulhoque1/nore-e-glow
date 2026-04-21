import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Img { id: string; images: string[]; name: string; }

const InstagramStrip = () => {
  const [shots, setShots] = useState<Img[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('id,images,name')
      .limit(6)
      .then(({ data }) => setShots((data as Img[])?.filter(p => p.images?.[0]) || []));
  }, []);

  if (shots.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7 }}
      className="py-20 md:py-28 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <div className="text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center gap-3">
          <span className="block w-10 h-px bg-gold" />
          <span className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">Community</span>
          <span className="block w-10 h-px bg-gold" />
        </div>
        <h2 className="font-display font-light text-bark mt-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
          As worn by <span className="italic text-gold">@noree.jewellery</span>
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-5 font-body text-[11px] uppercase tracking-[0.22em] text-bark hover:text-gold link-reveal"
        >
          <Instagram size={14} /> Follow on Instagram <ArrowUpRight size={12} />
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2.5">
        {shots.slice(0, 6).map((shot, i) => (
          <motion.a
            key={shot.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group aspect-square overflow-hidden relative bg-bark/10"
          >
            <img
              src={shot.images[0]}
              alt={`@noree on Instagram — ${shot.name}`}
              className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/55 transition-colors duration-300 flex items-center justify-center">
              <Instagram size={22} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
};

export default InstagramStrip;
