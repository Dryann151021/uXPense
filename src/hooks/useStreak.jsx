import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/users.js';

export function useStreak(userId) {
  const [streak, setStreak] = useState({
    current: 0,
    longest: 0,
    lastExpenseDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStreak = useCallback(async () => {
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

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return { streak, loading, error, refetch: fetchStreak };
}
