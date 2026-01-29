import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'business' | 'admin';
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
}

interface UserStore {
  currentUser: User | null;
  preferences: UserPreferences;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  clearUser: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  emailNotifications: true,
  pushNotifications: true,
  language: 'en',
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      preferences: defaultPreferences,

      setUser: (user) => set({ currentUser: user }),

      updateUser: (updates) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        })),

      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      clearUser: () =>
        set({
          currentUser: null,
          preferences: defaultPreferences,
        }),
    }),
    {
      name: 'user-storage',
    }
  )
);
