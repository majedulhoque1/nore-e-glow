import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  is_new_arrival: boolean | null;
  is_featured: boolean | null;
  category: string;
  created_at: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  rings: 'Rings',
  bracelets: 'Bracelets',
  'phone-charms': 'Phone Charms',
  necklaces: 'Necklaces',
  sets: 'Sets',
  'new-arrivals': 'New Arrivals',
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = CATEGORY_LABELS[slug || ''] || slug || '';

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (slug === 'new-arrivals') {
      query = query.eq('is_new_arrival', true);
    } else if (slug) {
      query = query.eq('category', slug);
    }

    query.order('created_at', { ascending: false }).then(({ data }) => {
      setProducts((data as Product[]) || []);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title={`${categoryName} — Nore'e Jewellery`}
        description={`Shop Nore'e ${categoryName} — handcrafted pieces delivered cash on delivery across Bangladesh.`}
        url={`/category/${slug}`}
      />
      <NavigationBar />

      <div className="bg-ivory-warm border-b border-border py-10 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="font-display font-medium text-bark" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)' }}>
            {categoryName}
          </h1>
          <div className="font-body text-xs text-bark-muted mt-2 flex items-center gap-1.5">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span>{categoryName}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <p className="font-body text-sm text-bark-muted mb-6">
          {loading ? '...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-[2px]" />
                  <Skeleton className="h-5 w-3/4 mt-3 rounded-[2px]" />
                  <Skeleton className="h-4 w-1/3 mt-2 rounded-[2px]" />
                </div>
              ))
            : products.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                  <p className="font-body text-bark-muted">No products found in {categoryName}</p>
                  <Link to="/shop" className="font-body text-sm text-gold hover:underline underline-offset-4">
                    Browse All Products
                  </Link>
                </div>
              )
              : products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    is_new_arrival={product.is_new_arrival ?? false}
                    index={i}
                  />
                ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
