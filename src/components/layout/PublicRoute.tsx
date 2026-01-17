import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading, error, checkAuth } = useAuth();

  const isAuthenticated = user !== null;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={checkAuth} />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}
