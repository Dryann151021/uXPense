'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header.jsx';
import WelcomeCard from '../components/dashboard/WelcomeCard.jsx';
import ExpenseChart from '../components/dashboard/ExpenseChart.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import UserStatusCard from '../components/dashboard/UserStatusCard.jsx';
import StreakCard from '../components/dashboard/StreakCard.jsx';
import MonthlyExpenseChart from '../components/dashboard/MonthlyExpenseChart.jsx';
import FAB from '../components/layout/FAB.jsx';
import { expenseApi } from '../api/expenses.js';
import { budgetApi } from '../api/budgets.js';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expenseData, budgetData] = await Promise.all([
        expenseApi.getExpenses(),
        budgetApi.getBudgets(),
      ]);
      setExpenses(expenseData || []);
      setBudgets(budgetData || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await loadData();
    };
    initFetch();
  }, [loadData]);

  const currentYear = new Date().getFullYear();
  const yearlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('en-US', {
      month: 'short',
    });
    const monthPrefix = `${currentYear}-${String(i + 1).padStart(2, '0')}`;

    const monthlyExpenses = expenses
      .filter((e) => {
        if (!e.created_at) return false;
        const d = new Date(e.created_at);
        const localMonthStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 7);
        return localMonthStr === monthPrefix;
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const monthlyBudget = budgets
      .filter((b) => b.month === monthPrefix)
      .reduce((sum, b) => sum + Number(b.limitAmount || 0), 0);

    return {
      name: month,
      Pengeluaran: monthlyExpenses,
      TotalBudget: monthlyBudget,
    };
  });

  // Aggregate weekly data for MonthlyExpenseChart
  const getDayName = (date) =>
    date.toLocaleString('en-US', { weekday: 'short' });
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const diffToMonday =
    today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diffToMonday));
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyDataMap = {};
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    // Correctly format day locally to YYYY-MM-DD
    const localDateStr = new Date(
      day.getTime() - day.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split('T')[0];
    weeklyDataMap[localDateStr] = {
      name: getDayName(day),
      Pengeluaran: 0,
    };
  }

  let weeklyTotalCount = 0;
  expenses.forEach((e) => {
    if (!e.created_at) return;
    const d = new Date(e.created_at);
    const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    if (dateStr && weeklyDataMap[dateStr]) {
      weeklyDataMap[dateStr].Pengeluaran += Number(e.amount || 0);
      weeklyTotalCount += 1;
    }
  });
  const weeklyData = Object.values(weeklyDataMap);

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="dashboard-grid">
          {/* Main Content Area */}
          <div className="dashboard-main">
            <WelcomeCard />
            <ExpenseChart data={yearlyData} loading={loading} />
            <RecentTransactions expenses={expenses} />
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-sidebar">
            <UserStatusCard />
            <MonthlyExpenseChart
              data={weeklyData}
              weeklyCount={weeklyTotalCount}
              loading={loading}
            />
            <StreakCard />
          </div>
        </div>
        <FAB to="/expense" />
      </main>
    </>
  );
}
