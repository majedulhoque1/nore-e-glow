import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <h2 className="font-display font-medium text-center text-bark" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)' }}>
        Shop by Collection
      </h2>
      <p className="font-body font-light text-bark-mid text-center mt-2 mb-10">
        From heirloom gold to everyday charm
      </p>

      <div className="flex md:grid md:grid-cols-6 gap-4 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="group cursor-pointer flex-shrink-0 w-[140px] md:w-auto"
          >
            <div className="aspect-square overflow-hidden bg-bark/10 rounded-[2px]">
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-bark/5 to-bark/15 group-hover:scale-[1.04] transition-transform duration-500" />
              )}
            </div>
            <p className="font-display font-medium text-[1.05rem] text-bark text-center mt-3 relative">
              {cat.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] w-0 bg-gold group-hover:w-full transition-all duration-300" />
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturedCollections;
