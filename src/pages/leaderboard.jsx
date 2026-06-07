'use client';

import Header from '../components/layout/Header.jsx';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable.jsx';

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Leaderboard</h1>
          <p className="text-muted" style={{ marginBottom: '24px' }}>
            Top performers ranked by XP, level, and streaks
          </p>
          <LeaderboardTable />
        </div>
      </main>
    </>
  );
}
