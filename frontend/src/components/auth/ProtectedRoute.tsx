import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('CUSTOMER' | 'OWNER' | 'ADMIN')[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // We defer the toast slightly so it doesn't try to render during router commit
    setTimeout(() => {
      toast.error('Not authorized to access this page');
    }, 0);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
