import { useState, useEffect, useCallback } from "react";
import notificationService, {
  Notification,
} from "@/services/notificationService";
import { useAuthStore } from "@/store/authStore";
import { useSocket } from "./useSocket";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuthStore();
  const { on, off, emit, isConnected } = useSocket();

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      // Avoid duplicates if already exists
      if (prev.some((n) => n._id === notification._id)) return prev;
      return [notification, ...prev];
    });
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId || !token) return;

    if (isConnected) {
      console.log("Joining socket room:", userId);
      emit("join", userId);
    }
  }, [isConnected, user, token, emit]);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId || !token) return;

    loadNotifications();
    loadUnreadCount();

    // Listen for real-time notifications when the dedicated Socket.IO server is available.
    on("notification", (data: Notification) => {
      console.log("New real-time notification received:", data);
      addNotification(data);
    });

    // REST polling keeps notifications visible on Vercel, where Socket.IO cannot
    // maintain a persistent server connection.
    const pollingInterval = window.setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 15000);

    return () => {
      window.clearInterval(pollingInterval);
      off("notification");
    };
  }, [on, off, addNotification, user, token]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load notifications",
      );
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
};
