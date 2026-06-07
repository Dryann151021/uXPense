'use client';

import { useState } from 'react';

function MedalIcon({ rank }) {
  const toneClass =
    rank === 1 ? 'is-gold' : rank === 2 ? 'is-silver' : 'is-bronze';

  return (
    <span className={`leaderboard-medal ${toneClass}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
        <path d="M11 12 5.12 2.2" />
        <path d="m13 12 5.88-9.8" />
        <path d="M8 7h8" />
        <circle cx="12" cy="17" r="5" />
        <path d="M12 18v-2h-.5" />
      </svg>
    </span>
  );
}

function StreakFlame() {
  return (
    <span className="leaderboard-streak-flame" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
      </svg>
    </span>
  );
}

const mockLeaderboard = [
  { rank: 1, username: 'Alex Chen', level: 15, totalXP: 5250, streak: 12 },
  { rank: 2, username: 'Sarah Johnson', level: 14, totalXP: 4800, streak: 10 },
  { rank: 3, username: 'Mike Tanaka', level: 13, totalXP: 4200, streak: 8 },
  { rank: 4, username: 'Emma Wilson', level: 12, totalXP: 3600, streak: 7 },
  { rank: 5, username: 'John Doe', level: 1, totalXP: 50, streak: 3 },
  { rank: 6, username: 'Lisa Anderson', level: 10, totalXP: 2800, streak: 5 },
  { rank: 7, username: 'David Kim', level: 9, totalXP: 2400, streak: 4 },
  { rank: 8, username: 'Jessica Brown', level: 8, totalXP: 1800, streak: 3 },
  { rank: 9, username: 'Robert Martinez', level: 7, totalXP: 1400, streak: 2 },
  { rank: 10, username: 'Maria Garcia', level: 6, totalXP: 1000, streak: 1 },
];

export default function LeaderboardTable() {
  const [sortBy, setSortBy] = useState('rank');

  const sortedData = [...mockLeaderboard].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank;
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'xp') return b.totalXP - a.totalXP;
    if (sortBy === 'streak') return b.streak - a.streak;
    return 0;
  });

  return (
    <div className="card">
      <div className="leaderboard-toolbar">
        <label htmlFor="sort-select" className="leaderboard-toolbar-label">
          Urutkan berdasarkan:
        </label>
        <select
          id="sort-select"
          className="form-select leaderboard-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="rank">Peringkat</option>
          <option value="level">Level</option>
          <option value="xp">Total XP</option>
          <option value="streak">Streak</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="col-rank">Rank</th>
              <th>Username</th>
              <th className="text-center">Level</th>
              <th className="text-right">Total XP</th>
              <th className="text-center">Streak</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user) => {
              const isYou = user.username === 'John Doe';
              return (
                <tr key={user.rank} className={isYou ? 'leaderboard-row-you' : ''}>
                  <td>
                    <span className="leaderboard-rank">
                      {user.rank <= 3 && <MedalIcon rank={user.rank} />}#{user.rank}
                    </span>
                  </td>
                  <td>
                    <span className="leaderboard-username">{user.username}</span>
                    {isYou && <span className="leaderboard-you-tag">(You)</span>}
                  </td>
                  <td className="text-center">
                    <span className="leaderboard-level-badge">{user.level}</span>
                  </td>
                  <td className="text-right">
                    <strong>{user.totalXP.toLocaleString('id-ID')} XP</strong>
                  </td>
                  <td className="text-center">
                    <span className="leaderboard-streak-icons">
                      {[...Array(Math.min(user.streak, 5))].map((_, i) => (
                        <StreakFlame key={i} />
                      ))}
                    </span>
                    <div className="leaderboard-streak-days">{user.streak} hari</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-stats">
        <h4 className="leaderboard-stats-title">Statistik Leaderboard</h4>
        <div className="leaderboard-stats-grid">
          <div>
            <div className="leaderboard-stat-label">Total Pengguna</div>
            <div className="leaderboard-stat-value is-primary">{mockLeaderboard.length}</div>
          </div>
          <div>
            <div className="leaderboard-stat-label">Level Tertinggi</div>
            <div className="leaderboard-stat-value is-flame">
              {Math.max(...mockLeaderboard.map((u) => u.level))}
            </div>
          </div>
          <div>
            <div className="leaderboard-stat-label">Total XP</div>
            <div className="leaderboard-stat-value is-success">
              {mockLeaderboard.reduce((sum, u) => sum + u.totalXP, 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
