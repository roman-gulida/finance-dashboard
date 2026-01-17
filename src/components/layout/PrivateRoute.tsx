import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { ReactNode } from 'react';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading, error, checkAuth } = useAuth();

  const isAuthenticated = user !== null;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={checkAuth} />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign_in" />;
}
