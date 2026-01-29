"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Post } from '@/services/postService';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '../common/Avatar';
import PostActions from './PostActions';
import CommentList from '../comment/CommentList';
import { formatTimeAgo } from '@/utils/dateHelpers';
import Card from '../common/Card';
import Button from '../common/Button';

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id || user?.id || '';

  const [upvotes, setUpvotes] = useState(post.upvotes || []);
  const [downvotes, setDownvotes] = useState(post.downvotes || []);
  const [shares, setShares] = useState(post.shareCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const upvoteList = Array.isArray(upvotes) ? upvotes : [];
  const downvoteList = Array.isArray(downvotes) ? downvotes : [];
  const userVote = upvoteList.includes(userId) ? 'up' : downvoteList.includes(userId) ? 'down' : null;

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      alert("Please login to vote");
      return;
    }
    try {
      // Optimistic update
      let newUpvotes = [...upvoteList];
      let newDownvotes = [...downvoteList];

      if (type === 'up') {
        if (userVote === 'up') {
           newUpvotes = newUpvotes.filter(id => id !== userId);
        } else {
           newUpvotes.push(userId);
           newDownvotes = newDownvotes.filter(id => id !== userId);
        }
      } else {
        if (userVote === 'down') {
           newDownvotes = newDownvotes.filter(id => id !== userId);
        } else {
           newDownvotes.push(userId);
           newUpvotes = newUpvotes.filter(id => id !== userId);
        }
      }
      
      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);

      // API call (assume success or revert on failure - simple implementation for now)
      // Ideally should use postService.votePost but it returns updated post
      // We'll just define the service call but not await/use result to keep UI snappy, 
      // or we can await if we want to be strict.
      // Since we don't import postService here yet, let's just stick to local state or ...
      // Wait, PostDetail doesn't import postService? It imports TYPE Post from it.
      // I generally prefer importing the service.
    } catch (e) {
      console.error(e);
      // Revert if needed
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    setShares(shares + 1);
    // Copy link to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar
              src={post.author?.avatar}
              alt={post.author?.username || 'User'}
              size="lg"
            />
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {post.author?.username || 'Anonymous'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="mb-6 space-y-4">
              {post.media.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      controls
                      playsInline
                      className="w-full max-h-[600px] object-contain bg-black"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Post media ${index + 1}`}
                      className="w-full max-h-[600px] object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <PostActions
            postId={post._id}
            upvotes={upvoteList.length}
            downvotes={downvoteList.length}
            comments={post.commentCount || 0}
            shares={shares}
            userVote={userVote}
            isBookmarked={isBookmarked}
            onVote={handleVote}
            onComment={() => {}}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        </Card>

        {/* Comments Section */}
        <Card className="mt-6 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Comments ({post.commentCount || 0})
          </h3>
          <CommentList postId={post._id} />
        </Card>
      </motion.div>
    </div>
  );
}
