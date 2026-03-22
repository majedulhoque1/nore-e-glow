import NavigationBar from '@/components/NavigationBar';
import HeroSection from '@/components/home/HeroSection';
import TrustBar from '@/components/home/TrustBar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import EditorialBanner from '@/components/home/EditorialBanner';
import NewArrivals from '@/components/home/NewArrivals';
import Footer from '@/components/Footer';

const Index = () => (
  <div className="min-h-screen bg-ivory">
    <NavigationBar />
    <HeroSection />
    <TrustBar />
    <FeaturedCollections />
    <FeaturedProducts />
    <EditorialBanner />
    <NewArrivals />
    <Footer />
  </div>
);

export default Index;
