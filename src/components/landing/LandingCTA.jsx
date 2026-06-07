import { Link } from 'react-router-dom';

export default function LandingCTA() {
  return (
    <section className="landing-cta">
      <div className="landing-cta-inner">
        <h2 className="landing-cta-title text-balance">
          Siap mulai perjalanan keuanganmu?
        </h2>
        <p className="landing-cta-subtitle text-pretty">
          Gratis, tanpa kartu kredit. Catat transaksi pertamamu dalam hitungan
          menit.
        </p>
        <Link to="/register" className="btn landing-cta-button">
          Buat akun gratis
        </Link>
      </div>
    </section>
  );
}
