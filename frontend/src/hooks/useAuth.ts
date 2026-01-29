import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setToken, logout } = useAuthStore();
  const router = useRouter();

  // Redundant initialization removed, handled in Providers.tsx

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser({
        _id: response.user._id || response.user.id,
        id: response.user.id || response.user._id,
        username: response.user.username,
        email: response.user.email,
        accountType: response.user.accountType || response.user.role || 'user',
        avatar: response.user.avatar,
        businessId: (response.user as any).businessId,
        role: (response.user as any).role,
      });
      setToken(response.token);
      router.push('/feed');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.error?.message || error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'business';
    category?: string;
    avatar?: File;
  }) => {
    try {
      const response = await authService.register(data);
      setUser({
        _id: response.user._id || response.user.id,
        id: response.user.id || response.user._id,
        username: response.user.username,
        email: response.user.email,
        accountType: response.user.accountType || response.user.role || 'user',
        avatar: response.user.avatar,
        businessId: (response.user as any).businessId,
        role: (response.user as any).role,
      });
      setToken(response.token);
      router.push('/feed');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.error?.message || error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = () => {
    console.log('useAuth: handleLogout called');
    authService.logout();
    logout();
    console.log('useAuth: State cleared, redirecting to /login');
    window.location.href = '/login';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
  };
};
