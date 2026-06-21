'use client';

import { useState, useCallback, useEffect } from 'react';
import { LevelContext } from './LevelContext.jsx';
import { usersApi } from '../api/users.js';

export function LevelProvider({ children, userId }) {
  const [level, setLevel] = useState({
    current: 1,
    currentXp: 0,
    xpRequiredForNext: 100,
    progressPercentage: 0,
    daily: { expensesCount: 0, remaining: 3 },
    lastXpDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const responseData = await usersApi.getLevel(userId);
      const levelData = responseData.level || {};
      setLevel({
        current: levelData.current || 1,
        currentXp: levelData.currentXp || 0,
        xpRequiredForNext: levelData.xpRequiredForNext || 100,
        progressPercentage: levelData.progressPercentage || 0,
        daily: levelData.daily || { expensesCount: 0, remaining: 3 },
        lastXpDate: levelData.lastXpDate || null,
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch level:', err);
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
    level,
    loading,
    error,
    refetch,
  };

  return (
    <LevelContext.Provider value={value}>{children}</LevelContext.Provider>
  );
}
