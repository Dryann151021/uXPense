'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.jsx';

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

export default function LeaderboardTable() {
  const [activeTab, setActiveTab] = useState('xp'); // 'xp' or 'streak'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await usersApi.getAll();
        setUsers(response.users || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const sortedData = [...users].sort((a, b) => {
    if (activeTab === 'xp') {
      return (b.user_xp || 0) - (a.user_xp || 0);
    }
    if (activeTab === 'streak') {
      return (b.current_streak || 0) - (a.current_streak || 0);
    }
    return 0;
  });

  return (
    <div className="card">
      <div className="leaderboard-tabs" style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <button
          className={`tab-btn ${activeTab === 'xp' ? 'active' : ''}`}
          onClick={() => setActiveTab('xp')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            background: activeTab === 'xp' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'xp' ? 'white' : 'var(--color-text)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Berdasarkan XP
        </button>
        <button
          className={`tab-btn ${activeTab === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveTab('streak')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            background: activeTab === 'streak' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'streak' ? 'white' : 'var(--color-text)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Berdasarkan Streak
        </button>
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
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>Loading...</td>
              </tr>
            ) : sortedData.map((user, index) => {
              const rank = index + 1;
              const isYou = currentUser?.username === user.username;
              return (
                <tr key={user.id} className={isYou ? 'leaderboard-row-you' : ''}>
                  <td>
                    <span className="leaderboard-rank">
                      {rank <= 3 && <MedalIcon rank={rank} />}#{rank}
                    </span>
                  </td>
                  <td>
                    <span className="leaderboard-username">{user.fullname || user.username}</span>
                    {isYou && <span className="leaderboard-you-tag">(You)</span>}
                  </td>
                  <td className="text-center">
                    <span className="leaderboard-level-badge">{user.current_level || 1}</span>
                  </td>
                  <td className="text-right">
                    <strong>{(user.user_xp || 0).toLocaleString('id-ID')} XP</strong>
                  </td>
                  <td className="text-center">
                    <span className="leaderboard-streak-icons">
                      {[...Array(Math.min(user.current_streak || 0, 5))].map((_, i) => (
                        <StreakFlame key={i} />
                      ))}
                    </span>
                    <div className="leaderboard-streak-days">{user.current_streak || 0} hari</div>
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
            <div className="leaderboard-stat-value is-primary">{users.length}</div>
          </div>
          <div>
            <div className="leaderboard-stat-label">Level Tertinggi</div>
            <div className="leaderboard-stat-value is-flame">
              {users.length > 0 ? Math.max(...users.map((u) => u.current_level || 1)) : 1}
            </div>
          </div>
          <div>
            <div className="leaderboard-stat-label">Total XP Semua</div>
            <div className="leaderboard-stat-value is-success">
              {users.reduce((sum, u) => sum + (u.user_xp || 0), 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
