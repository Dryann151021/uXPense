'use client';

import { useState } from 'react';
import { useForm } from '../../hooks/useForm.jsx';
import { formatRupiahInput, parseRupiahInput } from '../../utils/format.js';

export default function ExpenseForm({ onSubmit, budgets = [] }) {
  // Extract unique categories from budgets
  const categories = [...new Set(budgets.map((b) => b.category))].sort();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    form: formData,
    handleChange,
    resetForm,
  } = useForm({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAmountChange = (event) => {
    handleChange({
      target: {
        name: 'amount',
        value: formatRupiahInput(event.target.value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      category: formData.category,
      amount: parseRupiahInput(formData.amount),
      description: formData.description,
      date: formData.date,
    };

    if (!onSubmit) {
      console.log('Expense submitted:', payload);
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmit(payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMessage('Pengeluaran berhasil ditambahkan.');
    resetForm({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="card expense-form-card">
      <h3>Catat Pengeluaran</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled={categories.length > 0}>
              {categories.length > 0 ? 'Pilih Kategori' : 'Buat budget terlebih dahulu'}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">
              Jumlah
          </label>
          <input
            type="text"
            inputMode="numeric"
            id="amount"
            name="amount"
            className="form-input"
            placeholder="Rp.50.000"
            value={formData.amount}
            onChange={handleAmountChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Deskripsi
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            placeholder="e.g., Lunch at restaurant"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Menyimpan...' : 'Catat Pengeluaran'}
        </button>
      </form>
    </div>
  );
}
