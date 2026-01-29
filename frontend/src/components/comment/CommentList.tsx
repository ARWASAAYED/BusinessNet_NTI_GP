"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";
import Spinner from "../common/Spinner";
import commentService, { Comment } from "@/services/commentService";
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { user } = useAuth();
  const {
    comments,
    isLoading,
    error,
    createComment,
    deleteComment,
    likeComment,
    unlikeComment,
    refreshComments,
  } = useComments(postId);

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(content);
    } catch (err: any) {
      console.error("Failed to create comment:", err);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      await createComment(content, parentId);
    } catch (err: any) {
      console.error("Failed to create reply:", err);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, { content });
      // useComments will update via socket or we could manually refresh
    } catch (err: any) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (!comment || !user) return;

      const userId = user.id || user._id || "";
      const likes = comment.likes ?? [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (err: any) {
      console.error("Failed to like comment:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={refreshComments}
          className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Count */}
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <MessageSquare className="w-5 h-5" />
        <span className="font-semibold">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      {/* Comment Form */}
      {user && (
        <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <CommentForm
            onSubmit={handleCreateComment}
            placeholder="Write a comment..."
            submitLabel="Comment"
          />
        </div>
      )}

      {/* Comments List */}
      <AnimatePresence>
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CommentThread
                  comment={comment}
                  postId={postId}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentList;
