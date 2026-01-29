"use client";

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/app/providers';
import { Notification } from '@/services/notificationService';
import { useSocket } from '@/hooks/useSocket';

interface NotificationContextType {
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { unreadCount, addNotification } = useNotifications();
  const { showToast } = useToast();
  const { on, off } = useSocket();

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      showToast(notification.message, 'info');
      // No need to call addNotification here as useNotifications already does it
    };

    on('notification', handleNewNotification);

    return () => {
      off('notification', handleNewNotification);
    };
  }, [on, off, showToast]);

  return (
    <NotificationContext.Provider value={{ unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
