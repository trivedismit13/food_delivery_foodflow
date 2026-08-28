import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'SELLER') {
      return <Navigate to="/dashboard/creator" replace />;
    } else if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/verification/pending" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
}
