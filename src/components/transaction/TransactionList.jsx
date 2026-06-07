'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/format.js';

const mockTransactions = {
  expense: [
    {
      id: 1,
      category: 'Food',
      amount: 50000,
      description: 'Lunch at restaurant',
      date: '2024-06-06',
    },
    {
      id: 2,
      category: 'Transport',
      amount: 30000,
      description: 'Grab ride',
      date: '2024-06-05',
    },
    {
      id: 3,
      category: 'Shopping',
      amount: 200000,
      description: 'Groceries',
      date: '2024-06-04',
    },
    {
      id: 4,
      category: 'Entertainment',
      amount: 100000,
      description: 'Movie tickets',
      date: '2024-06-03',
    },
    {
      id: 5,
      category: 'Bills',
      amount: 500000,
      description: 'Electricity bill',
      date: '2024-06-02',
    },
  ],
};

export default function TransactionList() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const transactions = mockTransactions.expense;

  const filtered = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;

  const categories = [...new Set(transactions.map((t) => t.category))];

  const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="card">
      <h3>Daftar Pengeluaran</h3>

      <div className="form-group">
        <label htmlFor="category-filter" className="form-label">
          Filter Kategori
        </label>
        <select
          id="category-filter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="transaction-summary">
        <div className="transaction-summary-label">Total Pengeluaran</div>
        <div className="transaction-summary-value">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="transaction-items">
          {filtered.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-item-head">
                <span className="transaction-item-category">
                  {transaction.category}
                </span>
                <span className="transaction-item-amount">
                  -{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="transaction-item-desc">
                {transaction.description}
              </div>
              <div className="transaction-item-date">
                {formatDate(transaction.date)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="transaction-empty">Tidak ada data pengeluaran</div>
      )}
    </div>
  );
}
