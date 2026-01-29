import { useState, useEffect, useCallback } from 'react';
import commentService, { Comment } from '@/services/commentService';
import { useSocket } from './useSocket';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { on, off } = useSocket();

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await commentService.getCommentsByPost(postId);
      // Backend might return nested or flat. Organizing into threads (top-level only)
      const topLevelComments = data.filter((comment: Comment) => !comment.parentId);
      setComments(topLevelComments);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const handleNewComment = useCallback((newComment: Comment) => {
    if (newComment.postId !== postId) return;
    
    if (!newComment.parentId) {
      setComments(prev => [newComment, ...prev]);
    } else {
      // If it's a reply, it would ideally be handled by refreshing or 
      // by deep updating the parent comment in state. 
      // For simplicity in flat state, we might just re-fetch or find parent.
      loadComments(); 
    }
  }, [postId, loadComments]);

  const handleUpdateComment = useCallback((updatedComment: Comment) => {
    if (updatedComment.postId !== postId) return;
    setComments(prev => prev.map(c => c._id === updatedComment._id ? updatedComment : c));
  }, [postId]);

  const handleDeleteComment = useCallback((data: { commentId: string; postId: string }) => {
    if (data.postId !== postId) return;
    setComments(prev => prev.filter(c => c._id !== data.commentId));
  }, [postId]);

  useEffect(() => {
    loadComments();
    
    on('comment:new', handleNewComment);
    on('comment:update', handleUpdateComment);
    on('comment:delete', handleDeleteComment);

    return () => {
      off('comment:new', handleNewComment);
      off('comment:update', handleUpdateComment);
      off('comment:delete', handleDeleteComment);
    };
  }, [postId, on, off, loadComments, handleNewComment, handleUpdateComment, handleDeleteComment]);

  const createComment = async (content: string, parentId?: string) => {
    const newComment = await commentService.createComment({
      postId,
      content,
      parentId,
    });
    // Socket will broadcast this so we don't necessarily need to add it manually
    // but optimistic update is better.
    return newComment;
  };

  const deleteComment = async (commentId: string) => {
    await commentService.deleteComment(commentId);
  };

  const likeComment = async (commentId: string) => {
    await commentService.likeComment(commentId);
  };

  const unlikeComment = async (commentId: string) => {
    await commentService.unlikeComment(commentId);
  };

  return {
    comments,
    isLoading,
    error,
    createComment,
    deleteComment,
    likeComment,
    unlikeComment,
    refreshComments: loadComments,
  };
};
