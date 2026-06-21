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
import {
  getBudgetAmount,
  getBudgetMonth,
  getExpenseAmount,
  getExpenseMonth,
  getExpenseRecordedDate,
  getLocalDateKey,
  getStartOfWeek,
} from '../utils/format.js';

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
        return getExpenseMonth(e) === monthPrefix;
      })
      .reduce((sum, e) => sum + getExpenseAmount(e), 0);

    const monthlyBudget = budgets
      .filter((b) => getBudgetMonth(b) === monthPrefix)
      .reduce((sum, b) => sum + getBudgetAmount(b), 0);

    return {
      name: month,
      Pengeluaran: monthlyExpenses,
      TotalBudget: monthlyBudget,
    };
  });

  // Aggregate weekly data for MonthlyExpenseChart
  const getDayName = (date) =>
    date.toLocaleString('en-US', { weekday: 'short' });
  const startOfWeek = getStartOfWeek();

  const weeklyDataMap = {};
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const localDateStr = getLocalDateKey(day);
    weeklyDataMap[localDateStr] = {
      name: getDayName(day),
      Pengeluaran: 0,
    };
  }

  let weeklyTotalCount = 0;
  expenses.forEach((e) => {
    const dateStr = getLocalDateKey(getExpenseRecordedDate(e));

    if (dateStr && weeklyDataMap[dateStr]) {
      weeklyDataMap[dateStr].Pengeluaran += getExpenseAmount(e);
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
