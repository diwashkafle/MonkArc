import PublicHeader from './PublicHeader';
import HeroSection from './Herosection';
import FeaturesSection from './FeatureSection';
import HowItWorksSection from './HowItWorksSection';
import Footer from './Footer';
import PricingSection from './PriceSection';

export default function LandingPage() {


  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <PublicHeader/>

      {/* Hero Section */}
        <HeroSection/>

      {/* Features Section */}
     <FeaturesSection/>

      {/* How it Works */}
      <HowItWorksSection/>

        {/* Pricing */}
        <PricingSection/>
      {/* Footer */}
      <Footer/>
     </div>
  );
}