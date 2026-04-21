import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
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
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <div className="text-center mb-8">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">As worn by</span>
        <h2 className="font-display font-medium text-bark mt-2" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)' }}>
          @noree.jewellery
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 font-body text-xs uppercase tracking-[0.15em] text-bark-mid hover:text-gold transition-colors"
        >
          <Instagram size={14} /> Follow us
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
        {shots.slice(0, 6).map((shot, i) => (
          <motion.a
            key={shot.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group aspect-square overflow-hidden relative bg-bark/10"
          >
            <img
              src={shot.images[0]}
              alt={`@noree on Instagram — ${shot.name}`}
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/40 transition-colors flex items-center justify-center">
              <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
};

export default InstagramStrip;
