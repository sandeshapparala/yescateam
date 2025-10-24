// Protected Route Component
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'front_desk';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      if (requiredRole) {
        const hasAccess = 
          (requiredRole === 'super_admin' && role?.role === 'super_admin') ||
          (requiredRole === 'admin' && (role?.role === 'admin' || role?.role === 'super_admin')) ||
          (requiredRole === 'front_desk' && (role?.role === 'front_desk' || role?.role === 'admin' || role?.role === 'super_admin'));

        if (!hasAccess) {
          router.push('/admin/unauthorized');
        }
      }
    }
  }, [user, role, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
