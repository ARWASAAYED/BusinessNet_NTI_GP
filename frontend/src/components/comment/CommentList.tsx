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
import { useToast } from "@/app/providers";

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

  const { showToast } = useToast();

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(content);
      showToast(user ? "Comment posted!" : "Comment posted as Guest!", "success");
    } catch (err: any) {
      console.error("Failed to create comment:", err);
      showToast(err.message || "Failed to create comment", "error");
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      await createComment(content, parentId);
      showToast(user ? "Reply posted!" : "Reply posted as Guest!", "success");
    } catch (err: any) {
      console.error("Failed to create reply:", err);
      showToast(err.message || "Failed to create reply", "error");
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, { content });
      showToast("Comment updated", "success");
    } catch (err: any) {
      console.error("Failed to update comment:", err);
      showToast(err.message || "Failed to update comment", "error");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      showToast("Comment deleted", "success");
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      showToast(err.message || "Failed to delete comment", "error");
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      showToast("Sign in to like comments", "info");
      return;
    }
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (!comment) return;

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
      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <CommentForm
          onSubmit={handleCreateComment}
          placeholder={user ? "Write a comment..." : "Comment as Guest (or Sign in to join the conversation)..."}
          submitLabel="Comment"
        />
      </div>

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
