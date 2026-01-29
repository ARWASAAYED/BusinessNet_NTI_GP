import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  accountType: 'user' | 'business';
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: File;
}

const userService = {
  // Get user profile
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const formData = new FormData();
    
    if (data.username) formData.append('username', data.username);
    if (data.bio) formData.append('bio', data.bio);
    if (data.location) formData.append('location', data.location);
    if (data.website) formData.append('website', data.website);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await api.put('/users/me', formData);
    
    return response.data.data;
  },

  // Follow user
  followUser: async (userId: string): Promise<User> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data.data;
  },

  // Unfollow user
  unfollowUser: async (userId: string): Promise<User> => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data.data;
  },

  // Get followers
  getFollowers: async (userId: string): Promise<User[]> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data.data;
  },

  // Get following
  getFollowing: async (userId: string): Promise<User[]> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data.data;
  },

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },
};

export default userService;
