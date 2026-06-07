import { Link } from 'react-router-dom';
import AuthBrand from '../auth/AuthBrand.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';

export default function LandingNav() {
  return (
    <header className="landing-nav">
      <AuthBrand />
      <div className="landing-nav-actions">
        <ThemeToggle />
        <Link to="/login" className="btn btn-secondary landing-nav-login">
          Masuk
        </Link>
        <Link to="/register" className="btn btn-primary">
          Daftar gratis
        </Link>
      </div>
    </header>
  );
}
