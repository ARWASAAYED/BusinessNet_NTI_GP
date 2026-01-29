import { useEffect, useCallback, useState, useRef } from 'react';
import { usePostStore } from '@/store/postStore';
import postService, { Post } from '@/services/postService';
import { useSocket } from './useSocket';

export const useFeed = () => {
  const { posts, setPosts, addPost, updatePost, removePost, isLoading, setLoading } = usePostStore();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);
  const { on, off } = useSocket();

  const loadFeed = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : pageRef.current;
      const data = await postService.getFeed(currentPage);
      
      if (reset) {
        setPosts(data.posts);
        pageRef.current = 2;
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        pageRef.current += 1;
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  }, [setPosts, setLoading]);

  const handleNewPost = useCallback((post: Post) => {
    // Add post to top if not already exists
    addPost(post);
  }, [addPost]);

  const handlePostUpdate = useCallback((data: { postId: string; updates: Partial<Post> }) => {
    updatePost(data.postId, data.updates);
  }, [updatePost]);

  const handlePostDelete = useCallback((data: { postId: string }) => {
    removePost(data.postId);
  }, [removePost]);

  useEffect(() => {
    // Listen for real-time feed updates
    on('post:new', handleNewPost);
    on('post:update', handlePostUpdate);
    on('post:delete', handlePostDelete);

    return () => {
      off('post:new');
      off('post:update');
      off('post:delete');
    };
  }, [on, off, handleNewPost, handlePostUpdate, handlePostDelete]);

  return {
    posts,
    isLoading,
    hasMore,
    page,
    loadFeed,
    refreshFeed: () => loadFeed(true),
  };
};
