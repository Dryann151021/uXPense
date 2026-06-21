import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { StreakProvider } from '../../contexts/StreakProvider.jsx';
import { LevelProvider } from '../../contexts/LevelProvider.jsx';

export default function PrivateRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <StreakProvider userId={user?.id}>
      <LevelProvider userId={user?.id}>
        <Outlet />
      </LevelProvider>
    </StreakProvider>
  );
}
