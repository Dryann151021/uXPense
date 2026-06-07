import RegisterForm from '../components/auth/RegisterForm.jsx';

export const metadata = {
  title: 'Daftar - Cuan',
  description: 'Buat akun Cuan gratis dan mulai catat pengeluaran dengan gamifikasi.',
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-page-inner">
        <RegisterForm />
      </div>
    </main>
  );
}
