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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col items-center">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">
          Curated edits
        </span>
        <h2 className="font-display font-medium text-center text-bark mt-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
          Shop by Collection
        </h2>
        <div className="w-12 h-px bg-gold/50 mt-3" />
        <p className="font-body font-light text-bark-mid text-center mt-3 mb-10">
          From heirloom gold to everyday charm
        </p>
      </div>

      {/* Desktop asymmetric grid */}
      {categories.length > 0 && (
        <div className="hidden md:grid md:grid-cols-3 gap-4 md:gap-5">
          {featured && <Tile cat={featured} className="md:row-span-2 md:col-span-2 aspect-[4/5] md:aspect-auto md:min-h-[520px]" />}
          {stacked.map(cat => (
            <Tile key={cat.id} cat={cat} className="aspect-[4/3] md:aspect-auto md:min-h-[252px]" />
          ))}
          {rest.map(cat => (
            <Tile key={cat.id} cat={cat} className="aspect-[4/3] md:aspect-auto md:min-h-[252px]" />
          ))}
        </div>
      )}

      {/* Mobile snap-scroll carousel */}
      <div className="md:hidden flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory -mx-4 px-4">
        {categories.map(cat => (
          <div key={cat.id} className="snap-start flex-shrink-0 w-[220px] h-[280px]">
            <Tile cat={cat} className="w-full h-full" />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturedCollections;
