import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SectionHeading from './SectionHeading';

interface Look {
  id: string;
  name: string;
  slug: string;
  images: string[];
  category: string;
}

const ShopTheLook = () => {
  const [looks, setLooks] = useState<Look[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('id,name,slug,images,category')
      .eq('is_featured', true)
      .limit(3)
      .then(({ data }) => setLooks((data as Look[]) || []));
  }, []);

  if (looks.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 md:py-28 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <SectionHeading
        eyebrow="The Look Book"
        numeral="01"
        title={<>Editorial <span className="italic text-gold">edits.</span></>}
        align="left"
        subtitle="Three pieces, three moods. Click any to shop the look."
        rightSlot={
          <Link to="/shop" className="inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.22em] text-bark hover:text-gold link-reveal">
            View All <ArrowRight size={12} />
          </Link>
        }
      />

      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto hide-scrollbar -mx-4 md:mx-0 px-4 md:px-0 snap-x snap-mandatory">
        {looks.map((look, i) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative shrink-0 w-[78%] md:w-auto snap-center ${i === 1 ? 'md:translate-y-8' : ''}`}
          >
            <Link to={`/product/${look.slug}`} className="block">
              <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-bark/10 relative">
                <img
                  src={look.images?.[0] || '/placeholder.svg'}
                  alt={look.name}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                {/* Number marker */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="numeral text-ivory/90 text-3xl">0{i + 1}</span>
                  <span className="block w-6 h-px bg-gold" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                  <p className="font-body text-[10px] uppercase tracking-[0.28em] text-gold/90">
                    {look.category.replace('-', ' ')}
                  </p>
                  <h3 className="font-display italic text-2xl md:text-[1.65rem] mt-2 leading-tight">{look.name}</h3>
                  <span className="inline-flex items-center gap-1.5 mt-4 font-body text-[11px] uppercase tracking-[0.2em] text-ivory border-b border-gold pb-1 group-hover:gap-3 transition-all">
                    Shop this piece <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ShopTheLook;
