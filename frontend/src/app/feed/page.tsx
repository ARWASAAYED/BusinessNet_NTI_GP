"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostCreate from '@/components/post/PostCreate';
import PostList from '@/components/post/PostList';
import { useAuth } from '@/hooks/useAuth';
import { useFeed } from '@/hooks/useFeed';
import postService from '@/services/postService';
import TrendingTopics from '@/components/trend/TrendingTopics';
import SuggestedBusiness from '@/components/business/SuggestedBusiness';

export default function FeedPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { posts, isLoading, loadFeed } = useFeed();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed(true);
    }
  }, [isAuthenticated, loadFeed]);

  const handleCreatePost = async (content: string, media?: File[], category?: string) => {
    if (!user) return;
    try {
      const businessId = user.businessId;
      await postService.createPost({ content, media, businessId, category });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await postService.likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed - Expanded for better focus */}
        <main className="lg:col-span-8 space-y-6">
          <PostCreate onSubmit={handleCreatePost} />
          <PostList
            posts={posts}
            isLoading={isLoading}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
          />
        </main>

        {/* Right Sidebar - Trending & Business */}
        <aside className="hidden lg:block lg:col-span-4 space-y-8">
          <TrendingTopics />
          <SuggestedBusiness />
        </aside>
      </div>
    </div>
  );
}
