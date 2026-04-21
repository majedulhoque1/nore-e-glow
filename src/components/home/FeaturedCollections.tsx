import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number | null;
}

const FeaturedCollections = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data);
      });

    supabase
      .from('products')
      .select('category')
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, number> = {};
        data.forEach((p: { category: string }) => {
          map[p.category] = (map[p.category] || 0) + 1;
        });
        setCounts(map);
      });
  }, []);

  const Tile = ({
    cat,
    className = '',
  }: {
    cat: Category;
    className?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/category/${cat.slug}`)}
      className={`group cursor-pointer relative overflow-hidden rounded-[2px] bg-bark/10 ${className}`}
    >
      {cat.image_url ? (
        <img
          src={cat.image_url}
          alt={cat.name}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-bark/10 to-bark/30 group-hover:scale-[1.05] transition-transform duration-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/70">
              {counts[cat.slug] ? `${counts[cat.slug]} pieces` : 'Explore'}
            </p>
            <h3 className="font-display italic text-2xl md:text-3xl text-white leading-tight mt-1">
              {cat.name}
            </h3>
          </div>
          <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-body text-xs uppercase tracking-[0.15em] text-gold flex items-center gap-1.5 shrink-0 pb-1">
            Shop <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );

  const featured = categories[0];
  const stacked = categories.slice(1, 3);
  const rest = categories.slice(3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 md:py-32 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <div className="flex items-center gap-3">
          <span className="numeral text-gold/70 text-3xl md:text-4xl">04</span>
          <span className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
            Curated edits
          </span>
        </div>
        <h2 className="font-display font-light text-bark mt-3 leading-[1.05]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
          Shop by <span className="italic text-gold">collection.</span>
        </h2>
        <div className="rule-gold-solid w-10 mt-5 opacity-50" />
        <p className="font-body font-light text-bark-mid text-center mt-5 max-w-[440px]">
          From heirloom gold to everyday charm — find a category that speaks to your mood.
        </p>
      </div>

      {/* Desktop asymmetric grid */}
      {categories.length > 0 && (
        <div className="hidden md:grid md:grid-cols-3 gap-5 md:gap-6">
          {featured && <Tile cat={featured} className="md:row-span-2 md:col-span-2 aspect-[4/5] md:aspect-auto md:min-h-[560px]" />}
          {stacked.map(cat => (
            <Tile key={cat.id} cat={cat} className="aspect-[4/3] md:aspect-auto md:min-h-[270px]" />
          ))}
          {rest.map(cat => (
            <Tile key={cat.id} cat={cat} className="aspect-[4/3] md:aspect-auto md:min-h-[270px]" />
          ))}
        </div>
      )}

      {/* Mobile snap-scroll carousel */}
      <div className="md:hidden flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory -mx-4 px-4">
        {categories.map(cat => (
          <div key={cat.id} className="snap-start flex-shrink-0 w-[230px] h-[300px]">
            <Tile cat={cat} className="w-full h-full" />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturedCollections;
