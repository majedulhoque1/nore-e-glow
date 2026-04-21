import { motion } from 'framer-motion';
import { Sparkles, Package, Gift } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { MysteryChoiceCard } from '@/components/mystery/MysteryChoiceCard';
import heroImage from '@/assets/mystery-hero.jpg';

const MysteryCollectionPage = () => {
  return (
    <div className="min-h-screen bg-ivory">
      <SEOHead
        title="Mystery Collection — Surprise or Build Your Own"
        description="Two ways to discover Nore'e jewelry. Pick a curated surprise box or hand-build your own with 10% off."
        url="/mystery-collection"
      />
      <AnnouncementBar />
      <NavigationBar />

      {/* Hero */}
      <section className="bg-bark text-ivory min-h-[420px] md:min-h-[480px] flex items-center justify-center px-6 py-16 md:py-20 relative overflow-hidden">
        {/* Background image */}
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        {/* Dark gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-bark/70 via-bark/55 to-bark/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/60 via-transparent to-bark/40" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[1] flex flex-col items-center text-center max-w-[600px]"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-gold inline-flex items-center gap-2">
            <Sparkles size={14} /> Mystery Collection
          </span>
          <h1 className="font-display italic font-light text-ivory mt-4 leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            Two Ways to <span className="text-gold">Discover</span>
          </h1>
          <p className="font-body font-light text-sm text-ivory/80 mt-4 max-w-[440px]">
            Let us surprise you with a curated box, or hand-pick your own pieces and save.
          </p>
        </motion.div>
      </section>

      {/* Choice cards */}
      <section className="px-6 md:px-8 py-14 md:py-20">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <MysteryChoiceCard
            to="/mystery-collection/surprise"
            eyebrow="The Classic"
            title="Surprise Box"
            subtitle="Curated by us. Pure discovery."
            description="2–3 handpicked pieces you've never seen. Limited monthly drop. Includes a coupon for your next order."
            icon={Gift}
            cta="Open the Surprise"
            delay={0}
          />
          <MysteryChoiceCard
            to="/mystery-collection/build"
            eyebrow="Your Curation"
            title="Build Your Own"
            subtitle="Hand-pick 3–5 pieces. Save 10%."
            description="Choose your favorites from the full collection. Bundle 3 or more and unlock a 10% discount automatically."
            icon={Package}
            cta="Start Building"
            delay={0.1}
          />
        </div>

        <p className="text-center font-body text-xs text-bark-muted mt-10 italic max-w-[420px] mx-auto">
          Both options come with optional gift wrapping at checkout (+৳50).
        </p>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default MysteryCollectionPage;
