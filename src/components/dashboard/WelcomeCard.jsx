export default function WelcomeCard() {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Pagi';
    if (hour < 17) return 'Siang';
    return 'Malam';
  };

  return (
    <div className="welcome-card">
      <div className="welcome-card-text">
        <h2>
          Selamat {getTimeGreeting()}, <span className="welcome-name">Users!</span>
        </h2>
        <p>Semoga harimu menyenangkan, dan pengeluaran tidak berlebihan</p>
      </div>
      <span className="welcome-emoji" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </span>
    </div>
  );
}
