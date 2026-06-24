'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { StreakFlameSvg } from '../../../public/StreakFlameSvg.jsx';

function MedalIcon({ rank }) {
  const toneClass =
    rank === 1 ? 'is-gold' : rank === 2 ? 'is-silver' : 'is-bronze';

  return (
    <span className={`leaderboard-medal ${toneClass}`} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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

export default function LeaderboardTable() {
  const [activeTab, setActiveTab] = useState('xp');
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
    <div className="card leaderboard-card">
      <div className="leaderboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'xp' ? 'active' : ''}`}
          onClick={() => setActiveTab('xp')}
        >
          Berdasarkan XP
        </button>
        <button
          className={`tab-btn ${activeTab === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveTab('streak')}
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
                <td
                  colSpan="5"
                  className="text-center"
                  style={{ padding: '2rem' }}
                >
                  Loading...
                </td>
              </tr>
            ) : (
              sortedData.map((user, index) => {
                const rank = index + 1;
                const isYou = currentUser?.username === user.username;
                return (
                  <tr
                    key={user.id}
                    className={isYou ? 'leaderboard-row-you' : ''}
                  >
                    <td>
                      <span className="leaderboard-rank">
                        {rank <= 3 && <MedalIcon rank={rank} />}#{rank}
                      </span>
                    </td>
                    <td>
                      <span className="leaderboard-username">
                        {user.fullname || user.username}
                      </span>
                      {isYou && (
                        <span className="leaderboard-you-tag">(You)</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="leaderboard-level-badge">
                        {user.current_level || 1}
                      </span>
                    </td>
                    <td className="text-right">
                      <strong>
                        {(user.user_xp || 0).toLocaleString('id-ID')} XP
                      </strong>
                    </td>
                    <td className="text-center">
                      <span className="leaderboard-streak-icons">
                        <StreakFlameSvg className="leaderboard-streak-flame" />
                      </span>
                      <div className="leaderboard-streak-days">
                        {user.current_streak || 0} hari
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-stats">
        <h4 className="leaderboard-stats-title">Statistik Leaderboard</h4>
        <div className="leaderboard-stats-grid">
          <div>
            <div className="leaderboard-stat-label">Total Pengguna</div>
            <div className="leaderboard-stat-value is-primary">
              {users.length}
            </div>
          </div>
          <div>
            <div className="leaderboard-stat-label">Level Tertinggi</div>
            <div className="leaderboard-stat-value is-flame">
              {users.length > 0
                ? Math.max(...users.map((u) => u.current_level || 1))
                : 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
