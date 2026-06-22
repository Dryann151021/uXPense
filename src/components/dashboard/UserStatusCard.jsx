'use client';

import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useLevelContext } from '../../hooks/useLevelContext.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { usersApi } from '../../api/users.js';
import { expenseApi } from '../../api/expenses.js';

export default function UserStatusCard() {
  const { level, loading: levelLoading } = useLevelContext();
  const { user } = useAuth();
  const [topPercent, setTopPercent] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);

  const xpPercentage = level?.progressPercentage || 0;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await usersApi.getAll();
        const allUsers = res.users || [];
        if (allUsers.length === 0) return;
        const sorted = [...allUsers].sort((a, b) => (b.user_xp || 0) - (a.user_xp || 0));
        const myRank = sorted.findIndex((u) => u.username === user?.username) + 1;
        if (myRank > 0) {
          const pct = Math.round((myRank / sorted.length) * 100);
          setTopPercent(pct);
        }
      } catch (err) {
        console.error('Failed to fetch ranking:', err);
      }
    };
    const fetchExpenseCount = async () => {
      try {
        const expenses = await expenseApi.getExpenses();
        setTotalExpenses(expenses.length);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      }
    };
    if (user?.username) {
      fetchRanking();
      fetchExpenseCount();
    }
  }, [user]);


  return (
    <div className="user-status-card">
      <div className="status-title">Status kamu</div>

      <div className="status-profile">
        <div className="user-avatar-outline lg" aria-hidden="true">
          <img
            src="/placeholder-user.jpg"
            alt="users"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="status-profile-info">
          <div className="user-name">{user?.fullname || user?.username || 'Users'}</div>
          <div className="user-level">Status Level User</div>
          <div className="status-level-row">
            <span className="status-level-label">
              Level {level?.current || 1}
            </span>
            <div
              className="level-bar"
              title={`${level?.currentXp || 0} / ${level?.xpRequiredForNext || 100} XP`}
            >
              <div
                className="level-bar-fill"
                style={{ width: `${xpPercentage}%` }}
              ></div>
              <div
                className="level-bar-knob"
                style={{ left: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="status-stats">
        <div className="status-stat">
          <span
            className="status-stat-icon gold"
            aria-hidden="true"
            title="Total XP"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
          <span
            className="status-stat-value"
            title={`Total XP: ${level?.currentXp || 0}`}
          >
            {levelLoading ? <Skeleton width={36} /> : level?.currentXp || 0}
          </span>
        </div>
        <div className="status-stat">
          <span
            className="status-stat-icon flame"
            aria-hidden="true"
            title="Quest Harian"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </span>
          <span
            className="status-stat-value"
            title={`Quest Harian: ${level?.daily?.expensesCount || 0}/3`}
          >
            {levelLoading ? (
              <Skeleton width={28} />
            ) : (
              `${level?.daily?.expensesCount || 0}/3`
            )}
          </span>
        </div>
        <div className="status-stat">
          <span className="status-stat-icon gold" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </span>
          <span className="status-stat-value">
            {topPercent !== null ? `Top ${topPercent}%` : <Skeleton width={56} />}
          </span>
        </div>
        <div className="status-stat">
          <span className="status-stat-icon dark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
          <span className="status-stat-value">
            {totalExpenses !== null ? totalExpenses : <Skeleton width={24} />}
          </span>
        </div>
      </div>
    </div>
  );
}
