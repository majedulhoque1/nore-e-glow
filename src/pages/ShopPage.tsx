import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
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

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Rings', value: 'rings' },
  { label: 'Bracelets', value: 'bracelets' },
  { label: 'Phone Charms', value: 'phone-charms' },
  { label: 'Necklaces', value: 'necklaces' },
  { label: 'Sets', value: 'sets' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory);

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    // 'newest' is default order from query

    return result;
  }, [products, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('newest');
  };

  const hasActiveFilter = selectedCategory !== 'all' || sortBy !== 'newest';

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategory === cat.value}
                onChange={() => setSelectedCategory(cat.value)}
                className="w-4 h-4 rounded-[2px] border-border text-gold accent-gold cursor-pointer"
              />
              <span className={`font-body text-sm transition-colors ${selectedCategory === cat.value ? 'text-gold font-medium' : 'text-bark-mid group-hover:text-bark'}`}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Sort By</h3>
        <div className="space-y-2.5">
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="w-4 h-4 border-border text-gold accent-gold cursor-pointer"
              />
              <span className={`font-body text-sm transition-colors ${sortBy === opt.value ? 'text-gold font-medium' : 'text-bark-mid group-hover:text-bark'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilter && (
        <button
          onClick={clearFilters}
          className="font-body text-sm text-gold hover:underline underline-offset-4 mt-4 active:scale-[0.97] transition-transform"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title="Shop All Jewellery"
        description="Browse the full Nore'e collection — rings, bracelets, phone charms, necklaces and sets. Cash on delivery across all 64 districts of Bangladesh."
        url="/shop"
      />
      <NavigationBar />

      {/* Page Header */}
      <div className="bg-ivory-warm border-b border-border py-10 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="font-display font-medium text-bark" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)' }}>
            All Jewellery
          </h1>
          <div className="font-body text-xs text-bark-muted mt-2 flex items-center gap-1.5">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span>Shop</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[240px] shrink-0 border-r border-border bg-white p-6 sticky top-[64px] self-start" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <FilterContent />
        </aside>

        {/* Main Grid Area */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          {/* Mobile filter trigger + result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-body text-sm text-bark-muted">
              {loading ? '...' : `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            </p>

            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden flex items-center gap-1.5 font-body text-sm text-bark-mid border border-border px-3 py-1.5 rounded-[2px] hover:border-gold transition-colors active:scale-[0.97]">
                  <SlidersHorizontal size={14} />
                  Filter
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-[280px] p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display font-medium text-lg text-bark">Filters</h2>
                  <SheetClose asChild>
                    <button className="text-bark-muted hover:text-gold transition-colors">
                      <X size={20} />
                    </button>
                  </SheetClose>
                </div>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
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
              : filtered.length === 0
                ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                    <p className="font-body text-bark-muted">No products found</p>
                    {hasActiveFilter && (
                      <button
                        onClick={clearFilters}
                        className="font-body text-sm text-gold hover:underline underline-offset-4 active:scale-[0.97] transition-transform"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )
                : filtered.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      is_new_arrival={product.is_new_arrival ?? false}
                      index={i}
                    />
                  ))}
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
