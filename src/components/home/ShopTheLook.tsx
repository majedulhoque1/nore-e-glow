import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 md:py-20 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <div className="flex items-end justify-between mb-6 md:mb-10">
        <div>
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">Editorial</span>
          <h2 className="font-display font-medium text-bark mt-2" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)' }}>
            Shop the Look
          </h2>
        </div>
        <Link to="/shop" className="hidden md:inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] text-gold hover:underline underline-offset-4">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto hide-scrollbar -mx-4 md:mx-0 px-4 md:px-0 snap-x snap-mandatory">
        {looks.map((look, i) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group relative shrink-0 w-[78%] md:w-auto snap-center"
          >
            <Link to={`/product/${look.slug}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-bark/10 relative">
                <img
                  src={look.images?.[0] || '/placeholder.svg'}
                  alt={look.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold/90">
                    {look.category.replace('-', ' ')}
                  </p>
                  <h3 className="font-display italic text-xl md:text-2xl mt-1 leading-tight">{look.name}</h3>
                  <span className="inline-flex items-center gap-1.5 mt-3 font-body text-xs uppercase tracking-[0.15em] text-white border-b border-gold/60 pb-0.5 group-hover:border-gold transition-colors">
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
