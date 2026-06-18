import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Minus, Plus, Loader2, Check, MessageCircle, Truck, X, ZoomIn, Phone, Star } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { SEOHead } from '@/components/SEOHead';
import { trackProductView } from '@/lib/analytics';

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
  description: string | null;
  stock_qty: number | null;
}

/* ──────────────────────── Mobile Carousel ──────────────────────── */

const MobileGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="aspect-[4/5]">
                <img src={src || '/placeholder.svg'} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === selectedIdx ? 'bg-gold' : 'bg-bark-muted/30'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────── Desktop Gallery + Lightbox ──────────────────────── */

const DesktopGallery = ({ images, name, onZoom }: { images: string[]; name: string; onZoom: (idx: number) => void }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div>
      <button
        onClick={() => onZoom(activeIdx)}
        aria-label="Zoom image"
        className="aspect-[4/5] overflow-hidden block w-full relative group"
      >
        <motion.img
          key={activeIdx}
          src={images[activeIdx] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} className="text-bark" />
        </span>
      </button>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`aspect-[4/5] overflow-hidden border-2 transition-colors ${i === activeIdx ? 'border-gold' : 'border-transparent hover:border-border'}`}
            >
              <img src={src || '/placeholder.svg'} alt={`${name} thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Lightbox = ({ images, idx, onClose, onNav }: { images: string[]; idx: number; onClose: () => void; onNav: (i: number) => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/80 hover:text-gold" aria-label="Close">
        <X size={28} />
      </button>
      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        src={images[idx]}
        alt="Zoomed product"
        className="max-w-[92vw] max-h-[88vh] object-contain"
        onClick={e => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onNav(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === idx ? 'bg-gold' : 'bg-white/40'}`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  </AnimatePresence>
);

/* ──────────────────────── Product Page ──────────────────────── */

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const [btnState, setBtnState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setQty(1);
    setBtnState('idle');

    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProduct(data as Product);
        setLoading(false);
        trackProductView(data as Product);

        supabase
          .from('products')
          .select('*')
          .eq('category', (data as Product).category)
          .neq('id', (data as Product).id)
          .limit(4)
          .then(({ data: rel }) => setRelated((rel as Product[]) || []));
      });
  }, [slug]);

  // Show sticky CTA on mobile after scrolling past hero
  useEffect(() => {
    const onScroll = () => setShowStickyCTA(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || btnState !== 'idle') return;
    if (product.stock_qty !== null && product.stock_qty <= 0) return;
    setBtnState('loading');
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        slug: product.slug,
      }, qty);
      setBtnState('success');
      setTimeout(() => setBtnState('idle'), 1500);
    }, 400);
  }, [product, qty, addItem, btnState]);

  const handleWhatsApp = useCallback(() => {
    if (!product) return;
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '8801534756278';
    const msg = encodeURIComponent(
      `আমি অর্ডার করতে চাই:\n${product.name}\nমূল্য: ৳${product.price}\n\nনাম:\nঠিকানা:\nফোন:`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }, [product]);

  const savingsPercent = product?.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  // Stock display (DB stock_qty: null = untracked/unlimited, <=0 = sold out).
  const stockQty = product?.stock_qty ?? null;
  const outOfStock = stockQty !== null && stockQty <= 0;
  const lowStock = stockQty !== null && stockQty > 0 && stockQty <= 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <AnnouncementBar />
        <NavigationBar />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-12">
          <Skeleton className="aspect-[4/5] w-full rounded-[2px]" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-40 rounded-[2px]" />
            <Skeleton className="h-6 w-24 rounded-[2px]" />
            <Skeleton className="h-10 w-3/4 rounded-[2px]" />
            <Skeleton className="h-8 w-1/3 rounded-[2px]" />
            <Skeleton className="h-px w-full rounded-[2px]" />
            <Skeleton className="h-10 w-32 rounded-[2px]" />
            <Skeleton className="h-[52px] w-full rounded-[2px]" />
            <Skeleton className="h-[52px] w-full rounded-[2px]" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-ivory">
        <AnnouncementBar />
        <NavigationBar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-display text-2xl text-bark">Product not found</p>
          <button
            onClick={() => navigate('/shop')}
            className="font-body text-sm text-gold hover:underline underline-offset-4 active:scale-[0.97] transition-transform"
          >
            ← Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.length ? product.images : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-0">
      <SEOHead
        title={product.name}
        description={product.description || `${product.name} by Nore'e Jewellery. ৳${product.price}. Cash on delivery across Bangladesh.`}
        image={product.images?.[0]}
        url={`/product/${product.slug}`}
        type="product"
        price={product.price}
        category={product.category}
      />
      <AnnouncementBar />
      <NavigationBar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-6 md:gap-12">
          <div>
            <div className="md:hidden">
              <MobileGallery images={images} name={product.name} />
            </div>
            <div className="hidden md:block">
              <DesktopGallery images={images} name={product.name} onZoom={(i) => setLightboxIdx(i)} />
            </div>
          </div>

          <div className="md:sticky md:top-6 self-start">
            <nav className="font-body text-xs text-bark-muted mb-4 flex items-center gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-gold transition-colors capitalize">{product.category.replace('-', ' ')}</Link>
              <span>/</span>
              <span className="line-clamp-1">{product.name}</span>
            </nav>

            <span className="inline-block font-body text-[11px] uppercase tracking-[0.12em] bg-ivory-warm border border-border text-bark-muted px-3 py-1 rounded-sm">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="font-display font-medium text-3xl text-bark leading-tight mt-3">{product.name}</h1>

            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="font-body font-semibold text-2xl text-gold">৳{product.price}</span>
              {product.compare_at_price && (
                <span className="font-body text-bark-muted line-through text-lg">৳{product.compare_at_price}</span>
              )}
              {savingsPercent && (
                <span className="font-body text-[11px] bg-crimson text-white px-2 py-0.5 rounded-sm">{savingsPercent}% OFF</span>
              )}
            </div>

            {outOfStock ? (
              <p className="font-body text-sm font-medium text-crimson mt-3">Out of stock</p>
            ) : lowStock ? (
              <p className="font-body text-sm font-medium text-crimson mt-3">
                Only {stockQty} left
              </p>
            ) : null}

            <div className="border-t border-gold/20 my-5" />

            <div className={`flex items-center border border-border rounded-sm w-fit ${outOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-bark hover:bg-ivory-warm transition-colors active:scale-[0.95]"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-body font-medium text-sm text-bark border-x border-border">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock_qty ?? 99, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-bark hover:bg-ivory-warm transition-colors active:scale-[0.95]"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={btnState === 'loading' || outOfStock}
              className="w-full h-[52px] bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold-dark hover:-translate-y-px transition-all duration-200 mt-4 flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {outOfStock ? 'Out of Stock' : (
                <>
                  {btnState === 'loading' && <><Loader2 size={16} className="animate-spin" /> Adding...</>}
                  {btnState === 'success' && <><Check size={16} /> Added!</>}
                  {btnState === 'idle' && 'Add to Cart'}
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full h-[52px] border border-gold text-gold font-body text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold hover:text-bark transition-all duration-200 mt-3 flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <MessageCircle size={18} />
              Order via WhatsApp
            </button>

            {/* Trust badges row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={18} className="text-gold" />
                <span className="font-body text-[11px] text-bark-mid leading-tight">Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Check size={18} className="text-gold" />
                <span className="font-body text-[11px] text-bark-mid leading-tight">Hand-finished</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Phone size={18} className="text-gold" />
                <span className="font-body text-[11px] text-bark-mid leading-tight">WhatsApp Support</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Truck size={16} className="text-gold shrink-0" />
              <span className="font-body text-xs text-bark-muted">ঢাকার মধ্যে ৳60 · ঢাকার বাইরে ৳120 · COD</span>
            </div>

            <div className="border-t border-border my-5" />

            <Accordion type="multiple" className="w-full">
              <AccordionItem value="description" className="border-b border-border">
                <AccordionTrigger className="font-body font-medium text-sm text-bark py-4 hover:text-gold hover:no-underline">
                  Description
                </AccordionTrigger>
                <AccordionContent className="font-body font-light text-bark-mid leading-relaxed pb-4">
                  {product.description || 'No description available.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-b border-border">
                <AccordionTrigger className="font-body font-medium text-sm text-bark py-4 hover:text-gold hover:no-underline">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="font-body font-light text-bark-mid leading-relaxed pb-4">
                  Store in a dry place away from moisture and perfume.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="delivery" className="border-b-0">
                <AccordionTrigger className="font-body font-medium text-sm text-bark py-4 hover:text-gold hover:no-underline">
                  Delivery
                </AccordionTrigger>
                <AccordionContent className="font-body font-light text-bark-mid leading-relaxed pb-4">
                  COD delivery 2–4 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Reviews placeholder */}
        <section className="mt-16 md:mt-24 border-t border-border pt-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display text-xl text-bark">Reviews</h2>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="text-bark-muted/40" />
              ))}
            </span>
          </div>
          <p className="font-body text-sm text-bark-muted">
            No reviews yet. <span className="text-gold">Be the first to review this piece</span> after your purchase.
          </p>
        </section>

        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 md:mt-24 mb-8"
          >
            <div className="border-t border-border pt-10">
              <h2 className="font-display text-xl text-bark mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {related.map((p, i) => (
                  <ProductCard key={p.id} {...p} is_new_arrival={p.is_new_arrival ?? false} index={i} />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          idx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNav={i => setLightboxIdx(i)}
        />
      )}

      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-3 grid grid-cols-2 gap-2"
            style={{ boxShadow: '0 -4px 20px rgba(28,25,23,0.08)' }}
          >
            <button
              onClick={handleWhatsApp}
              className="h-12 border border-gold text-gold font-body text-xs uppercase tracking-[0.12em] rounded-[2px] flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
            <button
              onClick={handleAddToCart}
              disabled={btnState === 'loading' || outOfStock}
              className="h-12 bg-gold text-bark font-body font-medium text-xs uppercase tracking-[0.12em] rounded-[2px] flex items-center justify-center gap-1.5 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {outOfStock
                ? 'Out of Stock'
                : btnState === 'success'
                  ? <><Check size={14} /> Added</>
                  : <>Add to Cart · ৳{product.price * qty}</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default ProductPage;
