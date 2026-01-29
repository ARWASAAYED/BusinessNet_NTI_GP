import api from './api';

export interface Message {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  receiverId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
}

const messageService = {
  // Get conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  // Start or get conversation
  startConversation: async (recipientId: string): Promise<Conversation> => {
    const response = await api.post('/messages/conversations', { recipientId });
    return response.data.data;
  },

  // Get messages in a conversation
  getMessages: async (userId: string, page = 1, limit = 50): Promise<{ messages: Message[]; hasMore: boolean }> => {
    const response = await api.get(`/messages/${userId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Send message
  sendMessage: async (data: SendMessageData): Promise<Message> => {
    const response = await api.post('/messages', data);
    return response.data.data;
  },

  // Mark messages as read
  markAsRead: async (userId: string): Promise<void> => {
    await api.put(`/messages/${userId}/read`);
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/messages/${messageId}`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/messages/unread/count');
      return response.data.data.count;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get unread count');
    }
  },
};

export default messageService;
