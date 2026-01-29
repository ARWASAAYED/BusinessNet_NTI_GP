"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostActionsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  shares: number;
  userVote?: 'up' | 'down' | null; // Use 'up' | 'down' | null
  isBookmarked?: boolean;
  onVote?: (type: 'up' | 'down') => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export default function PostActions({
  postId,
  upvotes,
  downvotes,
  comments,
  shares,
  userVote,
  isBookmarked = false,
  onVote,
  onComment,
  onShare,
  onBookmark,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {/* Like Button */}
      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-full p-1 border border-gray-200 dark:border-gray-700">
        {/* Upvote Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onVote?.('up')}
          className={`p-1.5 rounded-full transition-all ${
            userVote === 'up'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 ${userVote === 'up' ? 'fill-current' : ''}`}
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
        
        <span className={`text-sm font-bold min-w-[20px] text-center ${
           userVote === 'up' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {upvotes}
        </span>

        {/* Downvote Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onVote?.('down')}
          className={`p-1.5 rounded-full transition-all ${
            userVote === 'down'
              ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 ${userVote === 'down' ? 'fill-current' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.button>

        <span className={`text-sm font-bold min-w-[20px] text-center ${
           userVote === 'down' ? 'text-secondary-600 dark:text-secondary-400' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {downvotes}
        </span>
      </div>

        {/* Comment Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComment}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{comments}</span>
        </motion.button>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{shares}</span>
        </motion.button>
      </div>

      {/* Bookmark Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBookmark}
        className={`p-2 rounded-full transition-all ${
          isBookmarked
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
      </motion.button>
    </div>
  );
}
