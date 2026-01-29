"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, Toast, ToastType } from '@/components/common/Toast';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, setLoading, logout } = useAuthStore();
  const [toasts, setToasts] = useState<Toast[]>([]);

  React.useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setToken(token);
        try {
          const userData = await authService.getCurrentUser();
          setUser({
            _id: userData._id || userData.id,
            id: userData.id || userData._id,
            username: userData.username,
            email: userData.email,
            accountType: userData.accountType || userData.role,
            avatar: userData.avatar,
            businessId: userData.businessId,
          });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setToken, setLoading, logout]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}



