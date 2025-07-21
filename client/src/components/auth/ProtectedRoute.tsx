import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  console.log('[ProtectedRoute] user:', user, 'loading:', loading, 'allowedRoles:', allowedRoles);

  if (loading) {
    // Optionally, render a loading spinner or skeleton
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but unauthorized role, redirect to 404 page
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;