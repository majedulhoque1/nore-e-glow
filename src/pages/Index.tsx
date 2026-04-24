import NavigationBar from '@/components/NavigationBar';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import HeroSection from '@/components/home/HeroSection';
import TrustBar from '@/components/home/TrustBar';
import BuildBoxPromo from '@/components/home/BuildBoxPromo';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import EditorialBanner from '@/components/home/EditorialBanner';
import InstagramStrip from '@/components/home/InstagramStrip';
import Testimonials from '@/components/home/Testimonials';

import Footer from '@/components/Footer';

const Index = () => (
  <div className="min-h-screen bg-ivory">
    <AnnouncementBar />
    <NavigationBar />
    <HeroSection />
    <TrustBar />
    <BuildBoxPromo />
    <FeaturedProducts />
    <EditorialBanner />
    <BuildBoxPromo />
    <Testimonials />
    <InstagramStrip />
    <Footer />
    <WhatsAppFAB />
  </div>
);

export default Index;
