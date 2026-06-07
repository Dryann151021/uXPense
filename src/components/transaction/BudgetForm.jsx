'use client';

import { useForm } from '../../hooks/useForm.jsx';

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
];

export default function BudgetForm() {
  const {
    form: formData,
    handleChange,
    resetForm,
  } = useForm({
    category: '',
    limitAmount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Budget submitted:', formData);
    resetForm({ category: '', limitAmount: '' });
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
        >
          Tambah Budget
        </button>
      </form>
    </div>
  );
}
