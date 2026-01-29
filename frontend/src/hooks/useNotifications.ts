import { useState, useEffect, useCallback } from 'react';
import notificationService, { Notification } from '@/services/notificationService';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from './useSocket';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuthStore();
  const { on, off, emit } = useSocket();

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // Avoid duplicates if already exists
      if (prev.some(n => n._id === notification._id)) return prev;
      return [notification, ...prev];
    });
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (!user) return; // Don't load if not logged in

    const userId = user.id || user._id;
    if (userId) {
      console.log('Joining socket room:', userId);
      emit('join', userId);
    }

    loadNotifications();
    loadUnreadCount();

    // Listen for real-time notifications
    on('notification', (data: Notification) => {
      console.log('New real-time notification received:', data);
      addNotification(data);
    });

    return () => {
      off('notification');
    };
  }, [on, off, emit, addNotification, user]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
};
