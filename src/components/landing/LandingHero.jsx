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
          <Link href="/register" className="btn btn-primary landing-cta-btn">
            Mulai sekarang
          </Link>
          <Link href="/login" className="btn btn-secondary landing-cta-btn">
            Sudah punya akun
          </Link>
        </div>
        <dl className="landing-stats">
          <div className="landing-stat">
            <dt className="landing-stat-value">12rb+</dt>
            <dd className="landing-stat-label">Pengguna aktif</dd>
          </div>
          <div className="landing-stat">
            <dt className="landing-stat-value">1,5jt</dt>
            <dd className="landing-stat-label">Transaksi dicatat</dd>
          </div>
          <div className="landing-stat">
            <dt className="landing-stat-value">4.8/5</dt>
            <dd className="landing-stat-label">Rating pengguna</dd>
          </div>
        </dl>
      </div>

      <div className="landing-hero-visual">
        <img
          src="/landing-hero.png"
          alt="Tampilan aplikasi Cuan menampilkan progres XP, level, dan grafik pengeluaran"
          width={520}
          height={520}
        />
      </div>
    </section>
  );
}
