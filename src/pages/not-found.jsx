import { Link } from 'react-router-dom';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'Halaman yang Anda cari tidak ditemukan.',
};

export default function NotFoundPage() {
  return (
    <main className="not-found-content">
      <h1>
        <span>404</span> | Not Found
      </h1>
    </main>
  );
}
