import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  is_new_arrival: boolean | null;
  is_featured: boolean | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8)
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 md:px-8 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col items-center mb-10">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">Most loved</span>
        <h2 className="font-display font-medium text-center text-bark mt-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
          Bestsellers
        </h2>
        <div className="flex items-center gap-1.5 mt-3 font-body text-xs text-bark-mid">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className="fill-gold text-gold" />
            ))}
          </span>
          <span>4.9 · 340 reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full rounded-[2px]" />
                <Skeleton className="h-5 w-3/4 mt-3 rounded-[2px]" />
                <Skeleton className="h-4 w-1/3 mt-2 rounded-[2px]" />
              </div>
            ))
          : products.length === 0
            ? <p className="col-span-full text-center font-body text-bark-mid py-12">Coming soon — check back!</p>
            : products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  is_new_arrival={product.is_new_arrival ?? false}
                  index={i}
                  ribbon={i === 0 ? '#1 Bestseller' : undefined}
                />
              ))}
      </div>
    </motion.section>
  );
};

export default FeaturedProducts;
