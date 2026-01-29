import api from './api';
import { Post } from './postService';

export interface TrendingTopic {
  name: string;
  count: number;
  isPromoted?: boolean;
  promotionLabel?: string;
  category?: 'General' | 'Technology' | 'Business' | 'Finance' | 'Design';
  growth?: number; // percentage growth in last 24h
  pulse?: {
    high: number;
    low: number;
    volume: number;
  };
}

const trendService = {
  getTrendingTopics: async (category?: string): Promise<TrendingTopic[]> => {
    const response = await api.get(`/trends/topics${category ? `?category=${category}` : ''}`);
    return response.data.data;
  },

  getTrendingPosts: async (page = 1, limit = 10, category?: string): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/trends/posts?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`);
    return response.data.data;
  },
};

export default trendService;
