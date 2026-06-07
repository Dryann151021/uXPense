import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function PublicRoute({ redirectTo = '/home' }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
