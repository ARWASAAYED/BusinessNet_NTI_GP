import api from './api';

export interface Business {
  _id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  verified: boolean;
  reputationScore: number;
  metrics: {
    trustScore: number;
    innovationScore: number;
    engagementRate: number;
    aiAuditScore: number;
  };
  reputationHistory: {
    score: number;
    reason: string;
    date: string;
  }[];
  followers: string[];
  hashtags?: { name: string }[];
  offerings?: {
    _id: string;
    name: string;
    description?: string;
    price?: number;
    category?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessData {
  name: string;
  description: string;
  category: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: File;
  coverImage?: File;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  hashtags?: string;
  logo?: File;
  coverImage?: File;
}

const businessService = {
  // Get business profile
  getBusiness: async (businessId: string): Promise<Business> => {
    const response = await api.get(`/businesses/${businessId}`);
    return response.data.data;
  },

  // Get businesses by user
  getUserBusinesses: async (userId: string): Promise<Business[]> => {
    const response = await api.get(`/businesses/user/${userId}`);
    return response.data.data;
  },

  // Create business
  createBusiness: async (data: CreateBusinessData): Promise<Business> => {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    
    if (data.website) formData.append('website', data.website);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.logo) formData.append('logo', data.logo);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await api.post('/businesses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },

  // Update business
  updateBusiness: async (businessId: string, data: UpdateBusinessData): Promise<Business> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.website) formData.append('website', data.website);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', JSON.stringify(data.address));
    if (data.socialLinks) formData.append('socialLinks', JSON.stringify(data.socialLinks));
    if (data.hashtags) formData.append('hashtags', data.hashtags);
    if (data.logo) formData.append('logo', data.logo);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await api.put(`/businesses/${businessId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },

  // Delete business
  deleteBusiness: async (businessId: string): Promise<void> => {
    await api.delete(`/businesses/${businessId}`);
  },

  // Follow business
  followBusiness: async (businessId: string): Promise<Business> => {
    const response = await api.post(`/businesses/${businessId}/follow`);
    return response.data.data;
  },

  // Unfollow business
  unfollowBusiness: async (businessId: string): Promise<Business> => {
    const response = await api.delete(`/businesses/${businessId}/follow`);
    return response.data.data;
  },

  // Get business analytics
  getAnalytics: async (businessId: string): Promise<any> => {
    const response = await api.get(`/businesses/${businessId}/analytics`);
    return response.data.data;
  },

  // Get AI Health Pulse
  getHealth: async (businessId: string): Promise<any> => {
    const response = await api.get(`/analytics/business/${businessId}`);
    return response.data.data;
  },

  // Search businesses
  searchBusinesses: async (query: string, category?: string): Promise<Business[]> => {
    let url = `/businesses/search?q=${encodeURIComponent(query)}`;
    if (category) url += `&category=${category}`;
    
    const response = await api.get(url);
    return response.data.data;
  },

  // Get businesses by category
  getByCategory: async (category: string, page = 1, limit = 10): Promise<{ businesses: Business[]; hasMore: boolean }> => {
    try {
      const response = await api.get(`/businesses/category/${category}?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load businesses');
    }
  },

  // Add offering
  addOffering: async (businessId: string, data: { name: string; description?: string; price?: number; category?: string }): Promise<Business> => {
    const response = await api.post(`/businesses/${businessId}/offerings`, data);
    return response.data.data;
  },

  // Remove offering
  removeOffering: async (businessId: string, offeringId: string): Promise<Business> => {
    const response = await api.delete(`/businesses/${businessId}/offerings/${offeringId}`);
    return response.data.data;
  },
  // Get detailed post performance
  getPostPerformance: async (businessId: string): Promise<any[]> => {
    const response = await api.get(`/businesses/${businessId}/performance`);
    return response.data.data;
  },
};

export default businessService;
