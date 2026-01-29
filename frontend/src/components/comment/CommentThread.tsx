"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentItem from './CommentItem';
import commentService, { Comment } from '@/services/commentService';

interface CommentThreadProps {
  comment: Comment;
  postId: string;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  depth?: number;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postId,
  onReply,
  onEdit,
  onDelete,
  onLike,
  depth = 0,
}) => {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.replies?.length || 0);

  useEffect(() => {
    if (showReplies && replies.length === 0 && replyCount > 0) {
      loadReplies();
    }
  }, [showReplies]);

  const loadReplies = async () => {
    try {
      setIsLoadingReplies(true);
      const data = await commentService.getReplies(comment._id);
      setReplies(data);
    } catch (err: any) {
      console.error('Failed to load replies:', err);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleReply = (commentId: string, content: string) => {
    onReply?.(commentId, content);
    setReplyCount(replyCount + 1);
    setShowReplies(true);
    
    // Reload replies to show the new one
    setTimeout(() => {
      loadReplies();
    }, 500);
  };

  const handleDelete = (commentId: string) => {
    if (commentId === comment._id) {
      onDelete?.(commentId);
    } else {
      // Delete reply
      setReplies(replies.filter(r => r._id !== commentId));
      setReplyCount(Math.max(0, replyCount - 1));
    }
  };

  return (
    <div>
      {/* Main Comment */}
      <CommentItem
        comment={comment}
        onReply={handleReply}
        onEdit={onEdit}
        onDelete={handleDelete}
        onLike={onLike}
        depth={depth}
      />

      {/* Show Replies Button */}
      {replyCount > 0 && !showReplies && (
        <button
          onClick={() => setShowReplies(true)}
          className="ml-14 mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {isLoadingReplies
            ? 'Loading replies...'
            : `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
        </button>
      )}

      {/* Hide Replies Button */}
      {showReplies && replyCount > 0 && (
        <button
          onClick={() => setShowReplies(false)}
          className="ml-14 mt-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
        >
          Hide replies
        </button>
      )}

      {/* Replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {replies.map((reply) => (
              <CommentThread
                key={reply._id}
                comment={reply}
                postId={postId}
                onReply={handleReply}
                onEdit={onEdit}
                onDelete={handleDelete}
                onLike={onLike}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentThread;
