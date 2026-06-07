'use client';

import { formatCurrency } from '../../utils/format.js';

const mockBudgets = [
  {
    id: 1,
    category: 'Food',
    limitAmount: 500000,
    currentSpent: 150000,
    month: '2024-06',
  },
  {
    id: 2,
    category: 'Transport',
    limitAmount: 300000,
    currentSpent: 120000,
    month: '2024-06',
  },
  {
    id: 3,
    category: 'Entertainment',
    limitAmount: 200000,
    currentSpent: 80000,
    month: '2024-06',
  },
  {
    id: 4,
    category: 'Shopping',
    limitAmount: 400000,
    currentSpent: 200000,
    month: '2024-06',
  },
];

export default function BudgetList() {
  const getProgressClass = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage > 80) return 'is-danger';
    if (percentage > 50) return 'is-warning';
    return 'is-safe';
  };

  return (
    <div className="card">
      <h3>Budget Bulan Ini</h3>
      <div className="budget-list">
        {mockBudgets.map((budget) => {
          const percentage = (budget.currentSpent / budget.limitAmount) * 100;
          const progressClass = getProgressClass(
            budget.currentSpent,
            budget.limitAmount,
          );

          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-item-head">
                <span className="budget-item-category">{budget.category}</span>
                <span className="budget-item-amount">
                  {formatCurrency(budget.currentSpent)} /{' '}
                  {formatCurrency(budget.limitAmount)}
                </span>
              </div>
              <div className="budget-progress">
                <div
                  className={`budget-progress-fill ${progressClass}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
