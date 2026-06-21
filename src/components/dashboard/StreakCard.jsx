'use client';

import { useStreakContext } from '../../hooks/useStreakContext.jsx';
import '../../styles/components/_streak.scss';

export default function StreakCard() {
  const { streak, loading } = useStreakContext();

  if (loading) {
    return (
      <div className="card streak-card">
        <div className="streak-body">Memuat streak...</div>
      </div>
    );
  }

  // Calculate current week's days (Mon - Sun)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon...
  const diffToMonday =
    today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diffToMonday));
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    // Local date string YYYY-MM-DD
    const dateStr = new Date(day.getTime() - day.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    weekDates.push({
      label: days[i],
      dateStr,
    });
  }

  // Determine active days based on streak
  const activeDates = new Set();
  if (streak.current > 0 && streak.lastExpenseDate) {
    const [y, m, d] = streak.lastExpenseDate.split('T')[0].split('-');
    const lastDate = new Date(y, m - 1, d);
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < streak.current; i++) {
      const activeDay = new Date(lastDate);
      activeDay.setDate(lastDate.getDate() - i);
      const activeDateStr = new Date(
        activeDay.getTime() - activeDay.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0];
      activeDates.add(activeDateStr);
    }
  }

  const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  const isTodayActive = activeDates.has(todayStr);

  return (
    <div className="card streak-card">
      <div className="streak-header">
        <span className="streak-title">Runtutan Mencatat</span>
      </div>

      <div className="streak-body">
        <h3 className="streak-subtitle">Streak</h3>
        <p className="streak-desc">
          Bukan cuma angka, streak bantu Anda membangun kebiasaan mencatat yang
          solid dan berkelanjutan.
        </p>

        <div className="streak-stats-row">
          <div className="streak-current">
            <span className="streak-number">{streak.current}</span>
            <svg
              className={`streak-thunder-icon ${isTodayActive ? 'active' : ''}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
            </svg>
          </div>
          <div className="streak-longest">
            🔥 Streak Terlama <strong>{streak.longest}</strong>
          </div>
        </div>

        <div className="streak-week-row">
          {weekDates.map((day) => {
            const isActive = activeDates.has(day.dateStr);
            return (
              <div
                key={day.dateStr}
                className={`streak-day ${isActive ? 'active' : ''}`}
              >
                <div className="streak-day-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
                  </svg>
                </div>
                <span className="streak-day-label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
