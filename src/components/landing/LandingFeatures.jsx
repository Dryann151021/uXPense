const features = [
  {
    title: 'XP & Level',
    description:
      'Setiap transaksi yang kamu catat menghasilkan XP. Kumpulkan poin untuk naik level dan buka pencapaian baru.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Streak Harian',
    description:
      'Jaga konsistensi dengan mencatat setiap hari. Streak yang panjang memberi bonus XP ekstra.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
      </svg>
    ),
  },
  {
    title: 'Grafik & Anggaran',
    description:
      'Pantau pengeluaran bulanan lewat grafik yang jelas dan atur anggaran per kategori dengan mudah.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Leaderboard',
    description:
      'Bandingkan progresmu dengan teman dan komunitas. Berlomba jadi yang paling konsisten setiap minggu.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

export default function LandingFeatures() {
  return (
    <section className="landing-features">
      <div className="landing-section-head">
        <h2 className="landing-section-title text-balance">
          Semua yang kamu butuh untuk konsisten
        </h2>
        <p className="landing-section-subtitle text-pretty">
          Fitur gamifikasi yang bikin mencatat keuangan terasa seperti main game.
        </p>
      </div>

      <div className="landing-feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="landing-feature-card">
            <span className="landing-feature-icon" aria-hidden="true">
              {feature.icon}
            </span>
            <h3 className="landing-feature-title">{feature.title}</h3>
            <p className="landing-feature-desc text-pretty">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
