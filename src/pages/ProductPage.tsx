import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Minus, Plus, Loader2, Check, MessageCircle, Truck } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────── Desktop Gallery ──────────────────────── */

const DesktopGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div>
      <div className="aspect-[4/5] overflow-hidden">
        <motion.img
          key={activeIdx}
          src={images[activeIdx] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
      </div>
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

  // Fetch product
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

        // Fetch related
        supabase
          .from('products')
          .select('*')
          .eq('category', (data as Product).category)
          .neq('id', (data as Product).id)
          .limit(4)
          .then(({ data: rel }) => setRelated((rel as Product[]) || []));
      });
  }, [slug]);

  const handleAddToCart = useCallback(() => {
    if (!product || btnState !== 'idle') return;
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
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '88017XXXXXXXX';
    const msg = encodeURIComponent(
      `আমি অর্ডার করতে চাই:\n${product.name}\nমূল্য: ৳${product.price}\n\nনাম:\nঠিকানা:\nফোন:`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }, [product]);

  const savingsPercent = product?.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
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

  /* ── Not found ── */
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-ivory">
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

  return (
    <div className="min-h-screen bg-ivory">
      <NavigationBar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10"
      >
        {/* Main 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-6 md:gap-12">
          {/* LEFT — Gallery */}
          <div>
            <div className="md:hidden">
              <MobileGallery images={product.images.length ? product.images : ['/placeholder.svg']} name={product.name} />
            </div>
            <div className="hidden md:block">
              <DesktopGallery images={product.images.length ? product.images : ['/placeholder.svg']} name={product.name} />
            </div>
          </div>

          {/* RIGHT — Details */}
          <div className="md:sticky md:top-6 self-start">
            {/* Breadcrumb */}
            <nav className="font-body text-xs text-bark-muted mb-4 flex items-center gap-1.5 flex-wrap">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-gold transition-colors capitalize">{product.category.replace('-', ' ')}</Link>
              <span>/</span>
              <span className="line-clamp-1">{product.name}</span>
            </nav>

            {/* Category badge */}
            <span className="inline-block font-body text-[11px] uppercase tracking-[0.12em] bg-ivory-warm border border-border text-bark-muted px-3 py-1 rounded-sm">
              {product.category.replace('-', ' ')}
            </span>

            {/* Name */}
            <h1 className="font-display font-medium text-3xl text-bark leading-tight mt-3">{product.name}</h1>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="font-body font-semibold text-2xl text-gold">৳{product.price}</span>
              {product.compare_at_price && (
                <span className="font-body text-bark-muted line-through text-lg">৳{product.compare_at_price}</span>
              )}
              {savingsPercent && (
                <span className="font-body text-[11px] bg-crimson text-white px-2 py-0.5 rounded-sm">{savingsPercent}% OFF</span>
              )}
            </div>

            <div className="border-t border-border my-5" />

            {/* Quantity */}
            <div className="flex items-center border border-border rounded-sm w-fit">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center font-body text-lg text-bark hover:bg-ivory-warm transition-colors active:scale-[0.95]"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-body font-medium text-sm text-bark border-x border-border">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock_qty ?? 99, q + 1))}
                className="w-10 h-10 flex items-center justify-center font-body text-lg text-bark hover:bg-ivory-warm transition-colors active:scale-[0.95]"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={btnState === 'loading'}
              className="w-full h-[52px] bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold-dark transition-colors duration-200 mt-4 flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-70"
            >
              {btnState === 'loading' && <><Loader2 size={16} className="animate-spin" /> Adding...</>}
              {btnState === 'success' && <><Check size={16} /> Added!</>}
              {btnState === 'idle' && 'Add to Cart'}
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full h-[52px] border border-gold text-gold font-body text-sm uppercase tracking-[0.1em] rounded-[2px] hover:bg-gold hover:text-bark transition-all duration-200 mt-3 flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <MessageCircle size={18} />
              Order via WhatsApp
            </button>

            {/* Delivery row */}
            <div className="flex items-center gap-2 mt-4">
              <Truck size={16} className="text-gold shrink-0" />
              <span className="font-body text-xs text-bark-muted">ঢাকার মধ্যে ৳60 · ঢাকার বাইরে ৳120 · COD</span>
            </div>

            <div className="border-t border-border my-5" />

            {/* Accordion */}
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
                  Delivery &amp; Exchange
                </AccordionTrigger>
                <AccordionContent className="font-body font-light text-bark-mid leading-relaxed pb-4">
                  COD delivery 2–4 business days. Exchange within 3 days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

      <Footer />
    </div>
  );
};

export default ProductPage;
