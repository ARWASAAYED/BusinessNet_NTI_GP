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
      const list = Array.isArray(data) ? data : [];
      // Backend might return nested or flat. Organizing into threads (top-level only)
      const topLevelComments = list.filter((comment: any) => !comment.parentId && !comment.parent);
      setComments(topLevelComments);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Backend returns either postId or post field - handle both
  const getCommentPostId = (comment: any) => comment.postId || comment.post;

  const handleNewComment = useCallback((newComment: any) => {
    if (String(getCommentPostId(newComment)) !== String(postId)) return;
    
    if (!newComment.parentId) {
      setComments(prev => {
        // Avoid duplicates
        if (prev.find(c => c._id === newComment._id)) return prev;
        return [newComment, ...prev];
      });
    } else {
      loadComments(); 
    }
  }, [postId, loadComments]);

  const handleUpdateComment = useCallback((updatedComment: any) => {
    if (String(getCommentPostId(updatedComment)) !== String(postId)) return;
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
    // Optimistically add to state immediately so user sees it right away
    if (!parentId) {
      setComments(prev => {
        if (prev.find(c => c._id === newComment._id)) return prev;
        return [newComment, ...prev];
      });
    } else {
      // Reload to get the updated thread with replies
      loadComments();
    }
    return newComment;
  };

  const deleteComment = async (commentId: string) => {
    // Optimistic removal
    setComments(prev => prev.filter(c => c._id !== commentId));
    try {
      await commentService.deleteComment(commentId);
    } catch (err) {
      // Revert on error
      loadComments();
      throw err;
    }
  };

  const likeComment = async (commentId: string) => {
    const result = await commentService.likeComment(commentId);
    if (result) setComments(prev => prev.map(c => c._id === commentId ? result : c));
  };

  const unlikeComment = async (commentId: string) => {
    const result = await commentService.unlikeComment(commentId);
    if (result) setComments(prev => prev.map(c => c._id === commentId ? result : c));
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
