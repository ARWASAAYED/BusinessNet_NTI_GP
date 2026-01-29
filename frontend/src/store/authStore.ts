import { create } from 'zustand';

interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  accountType: string;
  avatar?: string;
  businessId?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Always start as loading to avoid flash of content/mismatch
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isLoading: false 
  }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    set({ token, isAuthenticated: !!token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    console.log('authStore: Logging out...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
