'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBrand from './AuthBrand.jsx';
import { useForm } from '../../hooks/useForm.jsx';
import { useToggle } from '../../hooks/useToggle.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function LoginForm() {
  const [showPassword, togglePassword] = useToggle(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { form, handleChange, resetForm } = useForm({
    username: '',
    password: '',
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(form.username, form.password);
    setLoading(false);

    if (result.success) {
      resetForm();
      navigate('/home', { replace: true });
      return;
    }

    setError(result.error || 'Login gagal. Periksa username dan password.');
  };

  return (
    <div className="auth-card">
      <AuthBrand />

      <div className="auth-heading">
        <h1 className="auth-title">Selamat datang kembali</h1>
        <p className="auth-subtitle">
          Masuk untuk lanjut mencatat pengeluaran dan kumpulkan XP-mu.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="form-input"
            placeholder="Username kamu"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <div className="auth-label-row">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <Link to="/login" className="auth-link-inline">
              Lupa password?
            </Link>
          </div>
          <div className="auth-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Masukkan password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="auth-input-toggle"
              onClick={togglePassword}
              aria-label={
                showPassword ? 'Sembunyikan password' : 'Tampilkan password'
              }
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="auth-switch">
        Belum punya akun?{' '}
        <Link to="/register" className="auth-link">
          Daftar gratis
        </Link>
      </p>
    </div>
  );
}
