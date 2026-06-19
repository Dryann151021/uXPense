'use client';

import Header from '../components/layout/Header.jsx';
import WelcomeCard from '../components/dashboard/WelcomeCard.jsx';
import ExpenseChart from '../components/dashboard/ExpenseChart.jsx';
import UserStatusCard from '../components/dashboard/UserStatusCard.jsx';
import MonthlyExpenseChart from '../components/dashboard/MonthlyExpenseChart.jsx';
import FAB from '../components/layout/FAB.jsx';

export default function Home() {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="dashboard-grid">
          {/* Main Content Area */}
          <div className="dashboard-main">
            <WelcomeCard />
            <ExpenseChart />
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-sidebar">
            <UserStatusCard />
            <MonthlyExpenseChart />
          </div>
        </div>
        <FAB to="/expense" />
      </main>
    </>
  );
}
