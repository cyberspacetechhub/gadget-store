import useAuth from './useAuth';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const role = auth?.data?.user?.roles || auth?.user?.roles;

  return (
    allowedRoles.includes(role)
      ? <Outlet />
      : auth.user
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;