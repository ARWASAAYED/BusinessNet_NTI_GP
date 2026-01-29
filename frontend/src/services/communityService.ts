import api from './api';

export interface Community {
  _id: string;
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  isPrivate: boolean;
  createdBy: {
    _id: string;
    username: string;
    avatar?: string;
  };
  memberCount: number;
  members: string[];
  moderators: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityData {
  name: string;
  description: string;
  category: string;
  isPrivate?: boolean;
  coverImage?: File;
}

export interface UpdateCommunityData {
  name?: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
  coverImage?: File;
}

export interface CommunityMessage {
  _id: string;
  communityId: string;
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
    fullName?: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  isAnnouncement: boolean;
  createdAt: string;
}

export interface SendMessageData {
  communityId: string;
  content: string;
  media?: File[];
  isAnnouncement?: boolean;
}

const communityService = {
  // Get all communities
  getCommunities: async (page = 1, limit = 10): Promise<{ communities: Community[]; hasMore: boolean }> => {
    const response = await api.get(`/communities?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get community by ID
  getCommunity: async (communityId: string): Promise<Community> => {
    const response = await api.get(`/communities/${communityId}`);
    return response.data.data;
  },

  // Get user's communities
  getUserCommunities: async (userId: string): Promise<Community[]> => {
    const response = await api.get(`/communities/user/${userId}`);
    return response.data.data;
  },

  // Create community
  createCommunity: async (data: CreateCommunityData): Promise<Community> => {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    
    if (data.isPrivate !== undefined) formData.append('isPrivate', String(data.isPrivate));
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await api.post('/communities', formData);
    
    return response.data.data;
  },

  // Update community
  updateCommunity: async (communityId: string, data: UpdateCommunityData): Promise<Community> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.isPrivate !== undefined) formData.append('isPrivate', String(data.isPrivate));
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await api.put(`/communities/${communityId}`, formData);
    
    return response.data.data;
  },

  // Delete community
  deleteCommunity: async (communityId: string): Promise<void> => {
    await api.delete(`/communities/${communityId}`);
  },

  // Join community
  joinCommunity: async (communityId: string): Promise<Community> => {
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data.data;
  },

  // Leave community
  leaveCommunity: async (communityId: string): Promise<Community> => {
    const response = await api.delete(`/communities/${communityId}/leave`);
    return response.data.data;
  },

  // Get community members
  getMembers: async (communityId: string): Promise<{ members: any[]; hasMore: boolean; total: number }> => {
    const response = await api.get(`/communities/${communityId}/members`);
    return response.data.data;
  },

  // Update member role
  updateMemberRole: async (communityId: string, userId: string, role: string): Promise<any> => {
    const response = await api.put(`/communities/${communityId}/members/${userId}/role`, { role });
    return response.data.data;
  },

  // Ban/Kick member
  banMember: async (communityId: string, userId: string): Promise<any> => {
    const response = await api.delete(`/communities/${communityId}/members/${userId}`);
    return response.data.data;
  },

  // Unban member
  unbanMember: async (communityId: string, userId: string): Promise<any> => {
    const response = await api.post(`/communities/${communityId}/members/${userId}/unban`);
    return response.data.data;
  },

  // Delete community message
  deleteMessage: async (communityId: string, messageId: string): Promise<void> => {
    await api.delete(`/communities/${communityId}/messages/${messageId}`);
  },

  // Search communities
  searchCommunities: async (query: string): Promise<Community[]> => {
    const response = await api.get(`/communities/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  // Get communities by category
  getByCategory: async (category: string): Promise<Community[]> => {
    try {
      const response = await api.get(`/communities/category/${category}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load communities');
    }
  },

  // Get community messages
  getMessages: async (communityId: string, page = 1, limit = 50): Promise<{ messages: CommunityMessage[]; hasMore: boolean }> => {
    const response = await api.get(`/communities/${communityId}/messages?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Send community message
  sendMessage: async (data: SendMessageData): Promise<CommunityMessage> => {
    const formData = new FormData();
    formData.append('communityId', data.communityId);
    formData.append('content', data.content);
    if (data.isAnnouncement) formData.append('isAnnouncement', String(data.isAnnouncement));
    
    if (data.media) {
      data.media.forEach(file => formData.append('media', file));
    }

    const response = await api.post(`/communities/${data.communityId}/messages`, formData);
    return response.data.data;
  },
};

export default communityService;
