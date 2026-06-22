import LandingNav from '../components/landing/LandingNav.jsx';
import LandingHero from '../components/landing/LandingHero.jsx';
import LandingFeatures from '../components/landing/LandingFeatures.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <main className="landing-main">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
