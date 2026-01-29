import api from './api';

export interface Post {
  _id: string;
  authorId?: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    accountType?: 'personal' | 'business';
  };
  business?: {
    _id: string;
    name: string;
    logo?: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  category?: string;
  hashtags?: string[];
  mentions?: string[];
  likes: string[];
  upvotes: string[];
  downvotes: string[];
  commentCount: number;
  shareCount: number;
  impressions?: number;
  isPromoted?: boolean;
  // AI and Reputation Scores
  sentimentScore?: number;
  professionalismScore?: number;
  authenticityScore?: number;
  relevanceScore?: number;
  aiKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  media?: File[];
  category?: string;
  hashtags?: string[];
  mentions?: string[];
  businessId?: string;
  communityId?: string;
}

export interface UpdatePostData {
  content?: string;
  category?: string;
  hashtags?: string[];
}

const postService = {
  // Get feed posts
  getFeed: async (page = 1, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get posts by user
  getUserPosts: async (userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get posts by business
  getBusinessPosts: async (businessId: string, page = 1, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/posts/business/${businessId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get posts by community
  getCommunityPosts: async (communityId: string, page = 1, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/posts/community/${communityId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get single post
  getPost: async (postId: string): Promise<Post> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data.data;
  },

  // Create a new post
  createPost: async (data: CreatePostData): Promise<Post> => {
    const formData = new FormData();
    
    formData.append('content', data.content);
    
    if (data.category) formData.append('category', data.category);
    if (data.businessId) formData.append('businessId', data.businessId);
    if (data.communityId) formData.append('communityId', data.communityId);
    if (data.hashtags) formData.append('hashtags', JSON.stringify(data.hashtags));
    if (data.mentions) formData.append('mentions', JSON.stringify(data.mentions));
    
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', file);
      });
    }

    const response = await api.post('/posts', formData);
    
    return response.data.data;
  },

  // Update a post
  updatePost: async (postId: string, data: UpdatePostData): Promise<Post> => {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data.data;
  },

  // Delete a post
  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },

  // Like a post
  likePost: async (postId: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data.data;
  },

  // Unlike a post
  unlikePost: async (postId: string): Promise<Post> => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data.data;
  },

  // Share a post
  sharePost: async (postId: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data.data;
  },

  // Increment view count
  incrementView: async (postId: string): Promise<{ success: boolean; views: number }> => {
    const response = await api.post(`/posts/${postId}/view`);
    return response.data;
  },

  // Search posts
  searchPosts: async (query: string, page = 1, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
    const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Vote on a post
  votePost: async (postId: string, type: 'up' | 'down'): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/vote`, { type });
    return response.data.data;
  },
};

export default postService;
