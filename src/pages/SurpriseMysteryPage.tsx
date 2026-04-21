import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, Truck, Tag, Package, ArrowLeft } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { SEOHead } from '@/components/SEOHead';

interface Campaign {
  id: string;
  name: string;
  price: number;
  coupon_code: string;
  coupon_amount: number;
  coupon_expires_days: number | null;
  description: string | null;
  status: string | null;
}

const SurpriseMysteryPage = () => {
  const { addItem } = useCart();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase
      .from('mystery_box_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setCampaign(data as Campaign | null);
        setLoading(false);
      });
  }, []);

  const status = campaign?.status ?? 'inactive';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';
  const price = campaign?.price ?? 499;

  const handleAdd = () => {
    if (!campaign || !isActive) return;
    addItem({
      id: `mystery-${campaign.id}`,
      name: `Mystery Collection · ${campaign.name}`,
      price: campaign.price,
      image: '/placeholder.svg',
      slug: 'mystery-collection',
      isMystery: true,
      campaignId: campaign.id,
      couponCode: campaign.coupon_code,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title="Surprise Mystery Box — Curated Surprises"
        description="A handpicked surprise box of Nore'e jewelry. Limited inventory, no returns, ready to be surprised."
        url="/mystery-collection/surprise"
      />
      <AnnouncementBar />
      <NavigationBar />

      <div className="max-w-[1100px] mx-auto px-6 pt-6">
        <Link to="/mystery-collection" className="inline-flex items-center gap-1.5 font-body text-xs text-bark-muted hover:text-gold transition-colors">
          <ArrowLeft size={14} /> Back to Mystery Collection
        </Link>
      </div>

      <section className="bg-bark text-ivory min-h-[300px] flex items-center justify-center px-6 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-[15%] w-32 h-32 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-40 h-40 rounded-full bg-gold blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[1] flex flex-col items-center text-center max-w-[560px]"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold inline-flex items-center gap-2">
            <Sparkles size={14} /> Surprise Mystery Box
          </span>

          <h1 className="font-display italic font-light text-ivory mt-4 leading-[1.05]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Curated Surprises.<br />
            <span className="text-gold">Pure Discovery.</span>
          </h1>

          <p className="font-body font-light text-sm text-bark-muted mt-4 max-w-[420px]">
            Handpicked pieces you've never seen. Limited inventory.
            No returns. Ready to be surprised?
          </p>

          {loading ? (
            <Skeleton className="h-12 w-[260px] mt-6 rounded-[2px] bg-ivory/10" />
          ) : (
            <>
              <button
                onClick={handleAdd}
                disabled={!isActive}
                className={`mt-6 w-full max-w-[280px] h-12 font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? 'bg-gold text-bark hover:bg-gold-light hover:-translate-y-px'
                    : 'bg-bark-mid/40 text-bark-muted cursor-not-allowed'
                }`}
              >
                {!campaign && 'Coming Soon'}
                {campaign && isCompleted && 'Sold Out — Thank You!'}
                {campaign && status === 'inactive' && 'Coming Soon'}
                {campaign && isActive && (added ? '✓ Added to Cart' : `Add to Cart — ৳${price}`)}
              </button>
              {!isActive && campaign && (
                <p className="font-body text-[11px] text-bark-muted mt-3">
                  {isCompleted ? 'This drop is over — stay tuned for the next one.' : 'Check back soon — we drop a new mystery monthly.'}
                </p>
              )}
            </>
          )}
        </motion.div>
      </section>

      <section className="bg-white px-6 md:px-8 py-12 md:py-16">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-square bg-gradient-to-br from-bark via-bark to-bark-mid relative overflow-hidden rounded-[2px] flex items-center justify-center">
              <div className="absolute inset-4 border border-gold/40" />
              <div className="text-center text-gold">
                <Package size={64} strokeWidth={1} className="mx-auto" />
                <p className="font-display italic mt-4 text-2xl">Nore'e</p>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold/70 mt-1">Mystery Box</p>
              </div>
              <Sparkles size={20} className="absolute top-8 right-10 text-gold/60" />
              <Sparkles size={14} className="absolute bottom-12 left-10 text-gold/40" />
            </div>
            <p className="font-body text-xs text-bark-muted text-center mt-3 italic">
              Hand-packed. Every box is different.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display font-medium text-bark" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 1.8rem)' }}>
              What's Inside?
            </h2>

            <ul className="mt-5 space-y-3 font-body text-sm text-bark-mid">
              {[
                '2–3 handcrafted pieces',
                "Surprise combinations you won't find in the shop",
                'Branded unboxing experience',
                `৳${campaign?.coupon_amount ?? 200} coupon for your next order (expires ${campaign?.coupon_expires_days ?? 30} days)`,
                'Free delivery within Dhaka',
              ].map(line => (
                <li key={line} className="flex gap-2.5 items-start">
                  <span className="text-gold mt-1.5 shrink-0 w-1 h-1 rounded-full bg-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-ivory-warm border border-border p-5 rounded-[2px] relative">
              <div className="absolute top-3 right-3">
                <Sparkles size={16} className="text-gold" />
              </div>
              <p className="font-body text-[11px] uppercase tracking-[0.15em] text-bark-muted">Mystery Price</p>
              <p className="font-display font-medium text-gold leading-none mt-1" style={{ fontSize: 'clamp(2rem, 3vw, 2.4rem)' }}>
                ৳{price}
              </p>

              <div className="mt-4 pt-4 border-t border-border space-y-1.5">
                <div className="flex items-center gap-2 font-body text-sm text-bark-mid">
                  <Truck size={14} className="text-gold" />
                  <span>Delivery: ৳60 (Dhaka) · ৳120 (Outside)</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-bark-mid">
                  <Gift size={14} className="text-gold" />
                  <span>Total: ৳{price + 60} – ৳{price + 120}</span>
                </div>
                {campaign?.coupon_code && (
                  <div className="flex items-center gap-2 font-body text-sm text-bark-mid">
                    <Tag size={14} className="text-gold" />
                    <span>Coupon: <span className="font-semibold text-bark">{campaign.coupon_code}</span></span>
                  </div>
                )}
              </div>
            </div>

            <p className="font-body text-[11px] text-bark-muted mt-4 leading-relaxed">
              No returns on mystery boxes. All sales final.
              Coupon code sent via SMS/email after delivery.
            </p>

            <button
              onClick={handleAdd}
              disabled={!isActive}
              className={`mt-6 w-full h-12 font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] transition-all duration-200 active:scale-[0.97] ${
                isActive
                  ? 'bg-gold text-bark hover:bg-gold-dark hover:-translate-y-px'
                  : 'bg-bark-muted/30 text-bark-muted cursor-not-allowed'
              }`}
            >
              {!campaign && 'Coming Soon'}
              {campaign && isCompleted && 'Sold Out'}
              {campaign && status === 'inactive' && 'Notify me when live'}
              {campaign && isActive && (added ? '✓ Added to Cart' : `Add Mystery Box — ৳${price}`)}
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default SurpriseMysteryPage;
