export default function UserStatusCard() {
  const xpPercentage = 75;

  return (
    <div className="user-status-card">
      <div className="status-title">Status kamu</div>

      <div className="status-profile">
        <div className="user-avatar-outline lg" aria-hidden="true"></div>
        <div className="status-profile-info">
          <div className="user-name">Users</div>
          <div className="user-level">Status Level User</div>
          <div className="status-level-row">
            <span className="status-level-label">Level 1</span>
            <div className="level-bar">
              <div className="level-bar-fill" style={{ width: `${xpPercentage}%` }}></div>
              <div className="level-bar-knob" style={{ left: `${xpPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="status-stats">
        <div className="status-stat">
          <span className="status-stat-icon flame" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
            </svg>
          </span>
          <span className="status-stat-value">10</span>
        </div>
        <div className="status-stat">
          <span className="status-stat-icon gold" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </span>
          <span className="status-stat-value">Top 80%</span>
        </div>
        <div className="status-stat">
          <span className="status-stat-icon dark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
          <span className="status-stat-value">542</span>
        </div>
        <div className="status-stat">
          <span className="status-stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </span>
          <span className="status-stat-value">Badge</span>
        </div>
      </div>
    </div>
  );
}
