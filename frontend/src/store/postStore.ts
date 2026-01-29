import { create } from 'zustand';
import { Post } from '@/services/postService';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  setPosts: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  removePost: (id: string) => void;
  setCurrentPost: (post: Post | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  setPosts: (posts) =>
    set((state) => ({
      posts: typeof posts === 'function' ? posts(state.posts) : posts,
    })),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === id ? { ...post, ...updatedPost } : post
      ),
    })),
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== id),
    })),
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
