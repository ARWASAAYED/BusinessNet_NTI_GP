"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import PostCreate from '@/components/post/PostCreate';
import PostList from '@/components/post/PostList';
import { useAuth } from '@/hooks/useAuth';
import { useFeed } from '@/hooks/useFeed';
import postService from '@/services/postService';
import TrendingTopics from '@/components/trend/TrendingTopics';
import DuelList from '@/components/duel/DuelList';
import NetworkUpdates from '@/components/layout/NetworkUpdates';
import { useToast } from '@/app/providers';
import { useLanguage } from '@/components/layout/LanguageProvider';

function GuestBanner() {
  const { t } = useLanguage();
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <span>👋 {t('feed.guestBannerTitle') || 'Browsing as Guest'}</span>
          <span className="text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded-full font-black tracking-wider">
            {t('feed.guestBannerBadge') || 'Public Feed'}
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-white/85 mt-1">
          {t('feed.guestBannerDesc') || "You can read, test posting, and explore trends. Create an account to connect with businesses!"}
        </p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <Link href="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xs sm:text-sm font-bold transition-all">
          {t('nav.signIn') || 'Sign In'}
        </Link>
        <Link href="/register" className="px-5 py-2 bg-white text-primary-700 hover:bg-primary-50 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all hover:scale-105">
          {t('nav.getStarted') || 'Get Started'}
        </Link>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { posts, isLoading, loadFeed } = useFeed();
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      loadFeed(true);
    }
  }, [authLoading, loadFeed]);

  const handleCreatePost = async (content: string, media?: File[], category?: string) => {
    try {
      const businessId = user?.businessId;
      await postService.createPost({ content, media, businessId, category });
      showToast(user ? 'Post published successfully!' : 'Post created as Guest! Sign up to claim your profile.', 'success');
      loadFeed(true);
    } catch (error: any) {
      console.error('Error creating post:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to create post', 'error');
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
      showToast('Post deleted', 'success');
      loadFeed(true);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      showToast(error.response?.data?.message || 'Failed to delete post', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <main className="lg:col-span-8 space-y-6">
          {!isAuthenticated && <GuestBanner />}

          <PostCreate onSubmit={handleCreatePost} />

          <PostList
            posts={posts}
            isLoading={isLoading}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-8">
          <TrendingTopics />
          <DuelList limit={1} showTabs={false} />
          <NetworkUpdates />
        </aside>
      </div>
    </div>
  );
}
