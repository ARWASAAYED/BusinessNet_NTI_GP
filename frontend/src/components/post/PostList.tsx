"use client";

import React from 'react';
import PostCard from './PostCard';
import Spinner from '../common/Spinner';
import { Post } from '@/services/postService';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, isLoading, onLike, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-12 text-center">
        <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onLike={onLike} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PostList;
