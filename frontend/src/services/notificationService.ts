import api from './api';

export interface Notification {
  _id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'community' | 'badge';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  sender?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

const notificationService = {
  // Get notifications
  getNotifications: async (page = 1, limit = 20): Promise<{ notifications: Notification[]; hasMore: boolean }> => {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/unread');
    return response.data.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread/count');
    return response.data.data.count;
  },

  // Update notification preferences
  updatePreferences: async (preferences: any): Promise<void> => {
    await api.put('/notifications/preferences', preferences);
  },

  // Get notification preferences
  getPreferences: async (): Promise<any> => {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get preferences');
    }
  },
};

export default notificationService;
