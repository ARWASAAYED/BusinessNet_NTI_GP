"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, UserPlus, Search, MessageSquare, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import userService, { User } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function NetworkPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'suggestions'>('following');
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});

  const currentUserId = user?._id || (user as any)?.id;

  const loadNetworkData = async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const [followingRes, followersRes, allUsersRes] = await Promise.allSettled([
        userService.getFollowing(currentUserId),
        userService.getFollowers(currentUserId),
        userService.searchUsers('')
      ]);

      const followingData = followingRes.status === 'fulfilled' ? followingRes.value : [];
      const followersData = followersRes.status === 'fulfilled' ? followersRes.value : [];
      const allUsersData = allUsersRes.status === 'fulfilled' ? allUsersRes.value : [];

      setFollowing(Array.isArray(followingData) ? followingData : []);
      setFollowers(Array.isArray(followersData) ? followersData : []);

      const followingIds = new Set(followingData.map(u => u._id || (u as any).id));
      const filteredSuggestions = allUsersData.filter(
        u => (u._id || (u as any).id) !== currentUserId && !followingIds.has(u._id || (u as any).id)
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Failed to load network:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        loadNetworkData();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, isAuthenticated, isAuthLoading]);

  const handleToggleFollow = async (targetUser: User, currentlyFollowing: boolean) => {
    const targetId = targetUser._id || (targetUser as any).id;
    if (!targetId || actionLoadingMap[targetId]) return;

    setActionLoadingMap(prev => ({ ...prev, [targetId]: true }));
    try {
      if (currentlyFollowing) {
        await userService.unfollowUser(targetId);
        setFollowing(prev => prev.filter(u => (u._id || (u as any).id) !== targetId));
        setSuggestions(prev => [...prev, targetUser]);
      } else {
        await userService.followUser(targetId);
        setFollowing(prev => [...prev, targetUser]);
        setSuggestions(prev => prev.filter(u => (u._id || (u as any).id) !== targetId));
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setActionLoadingMap(prev => ({ ...prev, [targetId]: false }));
    }
  };

  const getFilteredList = () => {
    let list: User[] = [];
    if (activeTab === 'following') list = following;
    else if (activeTab === 'followers') list = followers;
    else list = suggestions;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      u => (u.fullName || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q) || (u.bio || '').toLowerCase().includes(q)
    );
  };

  const displayedList = getFilteredList();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white shadow-xl shadow-primary-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5 text-primary-200" />
              <span>{isRTL ? 'إدارة الشبكة المهنية' : 'Network Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isRTL ? 'علاقاتك وشبكة متابعيك' : 'Professional Connections'}
            </h1>
            <p className="text-primary-100 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
              {isRTL 
                ? 'تواصل مع رواد الأعمال وقادة القطاعات وتابع تطورات السوق المباشرة من شبكتك الموثّقة.' 
                : 'Connect with verified founders, industry operators, and grow your high-trust business network.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="block text-xl font-black">{following.length}</span>
              <span className="text-[10px] uppercase font-bold text-primary-200 tracking-wider">
                {isRTL ? 'تتابعهم' : 'Following'}
              </span>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="block text-xl font-black">{followers.length}</span>
              <span className="text-[10px] uppercase font-bold text-primary-200 tracking-wider">
                {isRTL ? 'متابعون' : 'Followers'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
          {[
            { id: 'following', label: isRTL ? 'أتابعهم' : 'Following', count: following.length, icon: UserCheck },
            { id: 'followers', label: isRTL ? 'المتابعون' : 'Followers', count: followers.length, icon: Users },
            { id: 'suggestions', label: isRTL ? 'اقتراحات الاتصال' : 'Discover', count: suggestions.length, icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-primary-50 dark:bg-primary-950 text-primary-600' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث بالاسم أو المعرف...' : 'Search connections...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{isRTL ? 'جاري التحميل...' : 'Syncing Network...'}</p>
        </div>
      ) : displayedList.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mx-auto mb-4 text-primary-600">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
            {activeTab === 'following'
              ? (isRTL ? 'لا تتابع أي شخص حالياً' : 'Not following anyone yet')
              : activeTab === 'followers'
              ? (isRTL ? 'لا يوجد متابعون بعد' : 'No followers yet')
              : (isRTL ? 'لا توجد اقتراحات جديدة' : 'No new suggestions found')}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            {activeTab === 'following'
              ? (isRTL ? 'استكشف قائمة الاقتراحات وتابع زملاء الصناعة لرؤية منشوراتهم في صفحتك الرئيسية.' : 'Explore suggestions to follow industry peers and view their updates on your feed.')
              : (isRTL ? 'شارك منشوراتك وتفاعل مع المجتمع لجذب زملاء جدد لشبكتك.' : 'Publish insightful posts and engage in industry battles to build your audience.')}
          </p>
          {activeTab === 'following' && (
            <Button
              onClick={() => setActiveTab('suggestions')}
              variant="primary"
              size="sm"
              className="rounded-xl"
            >
              {isRTL ? 'اكتشف زملاء جدد' : 'Discover Connections'}
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map(member => {
            const memberId = member._id || (member as any).id;
            const isCurrentlyFollowing = following.some(u => (u._id || (u as any).id) === memberId);
            const isBusy = actionLoadingMap[memberId];

            return (
              <Card 
                key={memberId} 
                className="p-5 flex items-center gap-4 hover:shadow-md transition-all border border-gray-100 dark:border-gray-800"
              >
                <div 
                  onClick={() => router.push(`/profile/${memberId}`)} 
                  className="cursor-pointer shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Avatar src={member.avatar} alt={member.username} size="lg" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 
                      onClick={() => router.push(`/profile/${memberId}`)}
                      className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate hover:text-primary-600 transition-colors cursor-pointer"
                    >
                      {member.fullName || member.username}
                    </h3>
                    {member.accountType === 'business' && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-primary-50 dark:bg-primary-950 text-primary-600 px-1.5 py-0.5 rounded">PRO</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono">@{member.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 leading-relaxed">
                    {member.bio || (isRTL ? 'عضو في شبكة الأعمال' : 'Professional Network Member')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => router.push(`/messages?userId=${memberId}`)}
                    title={isRTL ? 'إرسال رسالة' : 'Send Message'}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <Button
                    size="sm"
                    variant={isCurrentlyFollowing ? 'outline' : 'primary'}
                    isLoading={isBusy}
                    onClick={() => handleToggleFollow(member, isCurrentlyFollowing)}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold"
                  >
                    {isCurrentlyFollowing 
                      ? (isRTL ? 'إلغاء المتابعة' : 'Following') 
                      : (isRTL ? 'متابعة' : 'Follow')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
