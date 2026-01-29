"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '../common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // User is not authenticated, redirect to login
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // User is authenticated but trying to access auth pages (login/register)
        router.push('/feed');
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication check fails
  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
