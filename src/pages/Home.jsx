import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedListings from '../components/home/FeaturedListings';
import SellSection from '../components/home/SellSection';
import TrustSection from '../components/home/TrustSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import AnnouncementsBanner from '../components/home/AnnouncementsBanner';
import CTASection from '../components/home/CTASection';

const Home = () => {
    return (
        <main>
            <HeroSection />
            <CategorySection />
            <FeaturedListings />
            <SellSection />
            <TrustSection />
            <HowItWorksSection />
            <AnnouncementsBanner />
            <CTASection />
        </main>
    );
};

export default Home;

