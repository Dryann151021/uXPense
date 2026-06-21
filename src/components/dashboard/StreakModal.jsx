import '../../styles/components/_streak-modal.scss';

export default function StreakModal({ isOpen, onClose, streakCount }) {
  if (!isOpen) return null;

  return (
    <div className="streak-modal-overlay">
      <div className="streak-modal-content">
        <button className="streak-modal-close" onClick={onClose} aria-label="Tutup">
          &times;
        </button>

        <div className="streak-modal-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
          </svg>
        </div>

        <h2 className="streak-modal-count">{streakCount}</h2>
        <h3 className="streak-modal-title">hari beruntun</h3>

        <p className="streak-modal-desc">
          Jaga api semangat mencatat setiap hari agar tidak padam!
        </p>

        <button className="streak-modal-btn" onClick={onClose}>
          Lanjut mencatat
        </button>
      </div>
    </div>
  );
}
