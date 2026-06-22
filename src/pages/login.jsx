import LoginForm from '../components/auth/LoginForm.jsx';

export const metadata = {
  title: 'Masuk - Cuan',
  description: 'Masuk ke akun Cuan kamu untuk lanjut mencatat pengeluaran.',
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-page-inner">
        <LoginForm />
      </div>
    </main>
  );
}
