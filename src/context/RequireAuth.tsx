import { ReactNode } from 'react';
import { useAuth } from './Auth';
import { Navigate } from 'react-router';

type RequireAuthProps = {
  children: ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
