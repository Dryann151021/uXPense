'use client';

import { useState } from 'react';
import { useForm } from '../../hooks/useForm.jsx';


export default function BudgetForm({ onSubmit, budgets = [] }) {
  const existingCategories = [...new Set(budgets.map((b) => b.category))].sort();
  const [isAddingNew, setIsAddingNew] = useState(false);
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

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setIsAddingNew(true);
      handleChange({ target: { name: 'category', value: '' } });
    } else {
      setIsAddingNew(false);
      handleChange(e);
    }
  };

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
      setIsAddingNew(false);
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
    setIsAddingNew(false);
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
          {isAddingNew ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                placeholder="e.g., Kebutuhan Rumah"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsAddingNew(false);
                  handleChange({ target: { name: 'category', value: '' } });
                }}
              >
                Batal
              </button>
            </div>
          ) : (
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleCategorySelect}
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__NEW__">+ Tambah Kategori Baru</option>
            </select>
          )}
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
        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error">{error}</div>}
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
