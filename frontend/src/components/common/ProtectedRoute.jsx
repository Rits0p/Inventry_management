import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, isAdmin, isCustomer, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowed =
    role === 'Admin' ? isAdmin : role === 'Customer' ? isCustomer : true;

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
