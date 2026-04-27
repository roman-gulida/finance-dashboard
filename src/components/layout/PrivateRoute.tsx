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
    return (
      <div className="flex-1 flex items-center justify-center min-h-[90vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[90vh]">
        return <ErrorDisplay error={error} onRetry={checkAuth} />;
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign_in" />;
}
