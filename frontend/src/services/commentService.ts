import api from './api';

export interface Comment {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    id?: string;
    username: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  replies?: Comment[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

const commentService = {
  // Get comments for a post
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load comments');
    }
  },

  // Create a new comment
  createComment: async (data: CreateCommentData): Promise<Comment> => {
    try {
      const response = await api.post(`/posts/${data.postId}/comments`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  },

  // Update a comment
  updateComment: async (commentId: string, data: UpdateCommentData): Promise<Comment> => {
    try {
      const response = await api.put(`/comments/${commentId}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  },

  // Like a comment
  likeComment: async (commentId: string): Promise<Comment> => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to like comment');
    }
  },

  // Unlike a comment
  unlikeComment: async (commentId: string): Promise<Comment> => {
    try {
      const response = await api.delete(`/comments/${commentId}/like`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unlike comment');
    }
  },

  // Get replies for a comment
  getReplies: async (commentId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load replies');
    }
  },
};

export default commentService;
