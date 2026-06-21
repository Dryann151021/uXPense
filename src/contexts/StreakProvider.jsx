'use client';

import { useState, useCallback, useEffect } from 'react';
import { StreakContext } from './StreakContext.jsx';
import { usersApi } from '../api/users.js';

export function StreakProvider({ children, userId }) {
  const [streak, setStreak] = useState({
    current: 0,
    longest: 0,
    lastExpenseDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const streakData = await usersApi.getStreak(userId);
      setStreak({
        current: streakData.current || 0,
        longest: streakData.longest || 0,
        lastExpenseDate: streakData.lastExpenseDate || null,
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch streak:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch on mount and when userId changes
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  const value = {
    streak,
    loading,
    error,
    refetch,
  };

  return (
    <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
  );
}
