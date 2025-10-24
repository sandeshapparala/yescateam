// Members Layout - uses same dashboard layout
'use client';

import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="front_desk">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
