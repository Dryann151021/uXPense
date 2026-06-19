'use client';

import { useState } from 'react';
import { useForm } from '../../hooks/useForm.jsx';

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
];

export default function BudgetForm({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    form: formData,
    handleChange,
    resetForm,
  } = useForm({
    category: '',
    limitAmount: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      category: formData.category,
      limitAmount: Number(formData.limitAmount),
      month: formData.month,
    };

    if (!onSubmit) {
      console.log('Budget submitted:', payload);
      resetForm({
        category: '',
        limitAmount: '',
        month: new Date().toISOString().slice(0, 7),
      });
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMessage('Budget berhasil ditambahkan.');
    resetForm({
      category: '',
      limitAmount: '',
      month: new Date().toISOString().slice(0, 7),
    });
  };

  return (
    <div className="card">
      <h3>Tambah Budget Kategori</h3>
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
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="limitAmount" className="form-label">
            Limit Jumlah (Rp)
          </label>
          <input
            type="number"
            id="limitAmount"
            name="limitAmount"
            className="form-input"
            placeholder="e.g., 500000"
            value={formData.limitAmount}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Menyimpan...' : 'Tambah Budget'}
        </button>
      </form>
    </div>
  );
}
