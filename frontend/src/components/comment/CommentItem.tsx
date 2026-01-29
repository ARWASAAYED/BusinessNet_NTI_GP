"use client";

import React, { useState } from 'react';
import { Heart, Reply, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import CommentForm from './CommentForm';
import { Comment } from '@/services/commentService';
import { useAuth } from '@/hooks/useAuth';

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  onLike,
  depth = 0,
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const userId = user?.id || user?._id || '';
  const [isLiked, setIsLiked] = useState(
    user ? comment.likes.includes(userId) : false
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

  const isOwner = userId === comment.userId._id || userId === comment.userId.id;
  const maxDepth = 3;

  const handleLike = () => {
    if (!user) return;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(comment._id);
  };

  const handleReply = (content: string) => {
    onReply?.(comment._id, content);
    setIsReplying(false);
  };

  const handleEdit = (content: string) => {
    onEdit?.(comment._id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete?.(comment._id);
    }
  };

  const formatTimestamp = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString();
  };

  const dropdownItems = [
    ...(isOwner
      ? [
          {
            label: 'Edit',
            icon: <Edit2 className="w-4 h-4" />,
            onClick: () => setIsEditing(true),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: handleDelete,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar
          src={comment.userId?.avatar}
          alt={comment.userId?.username || 'User'}
          size="sm"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {comment.userId?.username || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(comment.createdAt)}
              </span>
            </div>

            {isOwner && dropdownItems.length > 0 && (
              <Dropdown 
                trigger={
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                }
                items={dropdownItems}
              />
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <CommentForm
              initialValue={comment.content}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              placeholder="Edit your comment..."
              submitLabel="Save"
            />
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isLiked
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                />
                {likesCount > 0 && <span>{likesCount}</span>}
              </motion.button>

              {/* Reply Button */}
              {depth < maxDepth && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <CommentForm
                  onSubmit={handleReply}
                  onCancel={() => setIsReplying(false)}
                  placeholder={`Reply to ${comment.userId?.username || 'user'}...`}
                  submitLabel="Reply"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
