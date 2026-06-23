'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthBrand from './AuthBrand.jsx';
import AppModal from '../ui/AppModal.jsx';
import { useForm } from '../../hooks/useForm.jsx';
import { useToggle } from '../../hooks/useToggle.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { EyeSvg } from '../../../public/EyeSvg.jsx';

export default function RegisterForm() {
  const [showPassword, togglePassword] = useToggle(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { form, handleChange, resetForm } = useForm({
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '',
  });
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const submitRegister = async () => {
    setError('');
    setLoading(true);

    const result = await register(form.username, form.fullname, form.password);
    setShowConfirmModal(false);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const loginResult = await login(form.username, form.password);
    setLoading(false);

    if (!loginResult.success) {
      setError(loginResult.error);
      return;
    }

    resetForm();
    setShowSuccessModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password utama.');
      return;
    }

    setShowConfirmModal(true);
  };

  return (
    <>
      <div className="auth-card">
        <AuthBrand />

        <div className="auth-heading">
          <h1 className="auth-title">Buat akun Cuan</h1>
          <p className="auth-subtitle">
            Mulai catat pengeluaran, naik level, dan saingi temanmu di
            leaderboard.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label className="form-label" htmlFor="fullname">
              Nama lengkap
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              className="form-input"
              placeholder="Nama lengkap"
              autoComplete="name"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

          {/* Kolom Password Utama */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="auth-input-wrap" style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
                minLength={6}
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={togglePassword}
                aria-label={
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EyeSvg showPassword={showPassword} />
              </button>
            </div>
          </div>

          {/* Kolom Konfirmasi Password (Struktur diperbaiki) */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              Konfirmasi Password
            </label>
            <div className="auth-input-wrap" style={{ position: 'relative' }}>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Konfirmasi password"
                autoComplete="new-password"
                minLength={6}
                value={form.confirmPassword || ''}
                onChange={handleChange}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={togglePassword}
                aria-label={
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EyeSvg showPassword={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <p
              className="form-error"
              role="alert"
              style={{ color: '#ff4d4f', fontSize: '14px', margin: '8px 0' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">
            Masuk di sini
          </Link>
        </p>
      </div>

      <AppModal
        isOpen={showConfirmModal}
        title="Buat akun baru?"
        description={`Akun dengan username "${form.username}" akan didaftarkan.`}
        confirmLabel="Daftar"
        confirmDisabled={loading}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={submitRegister}
      />
      <AppModal
        isOpen={showSuccessModal}
        title="Pendaftaran berhasil"
        description="Akun kamu telah dibuat dan kamu sudah masuk otomatis. Saatnya membuka dashboard."
        confirmLabel="Buka Dashboard"
        showCancel={false}
        onClose={() => navigate('/home', { replace: true })}
        onConfirm={() => navigate('/home', { replace: true })}
      />
    </>
  );
}
