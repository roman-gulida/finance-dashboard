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
    return (
      <div className="flex-1 flex items-center justify-center min-h-[90vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[90vh]">
        <ErrorDisplay error={error} onRetry={checkAuth} />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}
