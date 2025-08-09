import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AuthGuard = ({ children, requiredRole = null }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!auth?.accessToken || !auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && auth.user.roles !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthGuard;