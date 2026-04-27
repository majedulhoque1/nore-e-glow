import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Package } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { SEOHead } from '@/components/SEOHead';
import CartDrawer from '@/components/CartDrawer';
import { BuildBoxPanel, type SelectedItem } from '@/components/mystery/BuildBoxPanel';
import { BuildBoxProductCard } from '@/components/mystery/BuildBoxProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  stock_qty: number | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

const BuildYourBoxPage = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').gt('stock_qty', 0).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
    ]).then(([prodRes, catRes]) => {
      setProducts((prodRes.data ?? []) as Product[]);
      setCategories((catRes.data ?? []) as Category[]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeCat === 'all') return products;
    return products.filter(p => p.category === activeCat);
  }, [products, activeCat]);

  const selectedIds = useMemo(() => new Set(selected.map(s => s.id)), [selected]);
  const isFull = selected.length >= MAX_ITEMS;

  const toggleProduct = (p: Product) => {
    if (selectedIds.has(p.id)) {
      setSelected(prev => prev.filter(s => s.id !== p.id));
    } else if (!isFull) {
      setSelected(prev => [...prev, {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || '/placeholder.svg',
        slug: p.slug,
      }]);
    }
  };

  const handleAddToCart = () => {
    if (selected.length < MIN_ITEMS) return;
    const subtotal = selected.reduce((s, i) => s + i.price, 0);
    const total = subtotal - Math.round(subtotal * 0.1);

    addItem({
      id: `custom-box-${Date.now()}`,
      name: `Custom Box · ${selected.length} pieces`,
      price: total,
      image: selected[0].image,
      slug: 'custom-mystery-box',
      isMystery: true,
      isCustomBox: true,
      customBoxItems: selected,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelected([]);
      setCartOpen(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title="Build Your Own Mystery Box — Custom Curation"
        description="Hand-pick 3–5 pieces from our collection and save 10%. Custom-curated jewelry box, made by you."
        url="/mystery-collection/build"
      />
      <AnnouncementBar />
      <NavigationBar />

      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <Link to="/mystery-collection" className="inline-flex items-center gap-1.5 font-body text-xs text-bark-muted hover:text-gold transition-colors">
          <ArrowLeft size={14} /> Back to Mystery Collection
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-bark text-ivory px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-[15%] w-40 h-40 rounded-full bg-gold blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-[1100px] mx-auto text-center"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold inline-flex items-center gap-2">
            <Package size={14} /> Build Your Own
          </span>
          <h1 className="font-display italic font-light text-ivory mt-3 leading-[1.05]" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Curate Your <span className="text-gold">Custom Box</span>
          </h1>
          <p className="font-body font-light text-sm text-bark-muted mt-3 max-w-[480px] mx-auto">
            Hand-pick 3 to 5 pieces from our collection. Save 10% when you bundle.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/10 border border-gold/30 rounded-full">
            <Sparkles size={12} className="text-gold" />
            <span className="font-body text-xs text-gold">10% off · Free Dhaka delivery · Optional gift wrap</span>
          </div>
        </motion.div>
      </section>

      {/* Main grid */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
          {/* Products */}
          <div>
            {/* Category filter */}
            {!loading && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <CatChip label="All" active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
                {categories.map(c => (
                  <CatChip
                    key={c.id}
                    label={c.name}
                    active={activeCat === c.slug}
                    onClick={() => setActiveCat(c.slug)}
                  />
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[4/5] w-full rounded-[2px]" />
                    <Skeleton className="h-4 w-3/4 mt-3" />
                    <Skeleton className="h-9 w-full mt-3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-dashed border-border rounded-[2px] py-20 text-center">
                <Package size={32} className="text-bark-muted mx-auto mb-3" strokeWidth={1.2} />
                <p className="font-display text-lg text-bark-mid">Coming back soon</p>
                <p className="font-body text-xs text-bark-muted mt-1">No products available in this category right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {filtered.map(p => (
                  <BuildBoxProductCard
                    key={p.id}
                    product={p}
                    selected={selectedIds.has(p.id)}
                    disabled={isFull}
                    onToggle={() => toggleProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sticky panel — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <BuildBoxPanel
                items={selected}
                min={MIN_ITEMS}
                max={MAX_ITEMS}
                onRemove={(id) => setSelected(prev => prev.filter(s => s.id !== id))}
                onAddToCart={handleAddToCart}
                added={added}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile bottom panel */}
      <div className="lg:hidden sticky bottom-0 z-20 bg-white border-t border-border shadow-[0_-4px_20px_rgba(28,25,23,0.08)]">
        <div className="px-4 py-4">
          <BuildBoxPanel
            items={selected}
            min={MIN_ITEMS}
            max={MAX_ITEMS}
            onRemove={(id) => setSelected(prev => prev.filter(s => s.id !== id))}
            onAddToCart={handleAddToCart}
            added={added}
          />
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

const CatChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 h-9 font-body text-xs uppercase tracking-[0.1em] rounded-full border transition-all ${
      active
        ? 'bg-bark text-ivory border-bark'
        : 'bg-transparent text-bark-mid border-border hover:border-gold hover:text-gold'
    }`}
  >
    {label}
  </button>
);

export default BuildYourBoxPage;
