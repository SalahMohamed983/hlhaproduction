import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuth, user } = useAuth();
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles?.length && !roles.includes(user?.role)) {
    const fallback = user?.role === 'EMPLOYEE' ? '/dashboard/employee/tasks' : '/dashboard/admin/overview';
    return <Navigate to={fallback} replace />;
  }
  return children;
}
