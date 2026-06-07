import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';

export const metadata = {
  title: 'Masuk - Cuan',
  description: 'Masuk ke akun Cuan kamu untuk lanjut mencatat pengeluaran.',
};

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-page-inner">
        <LoginForm />
      </div>
    </main>
  );
}
