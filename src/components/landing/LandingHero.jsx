import { Link } from 'react-router-dom';

export default function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <span className="landing-badge">
          <span className="landing-badge-dot" aria-hidden="true"></span>
          Catat pengeluaran jadi seru
        </span>
        <h1 className="landing-hero-title text-balance">
          Kelola keuangan sambil naik level
        </h1>
        <p className="landing-hero-subtitle text-pretty">
          Cuan mengubah pencatatan pengeluaran jadi permainan. Kumpulkan XP,
          jaga streak harian, dan saingi temanmu di leaderboard.
        </p>
        <div className="landing-hero-actions">
          <Link to="/home" className="btn btn-primary landing-cta-btn">
            Mulai sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
