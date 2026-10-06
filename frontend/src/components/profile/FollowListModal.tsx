"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search, UserCheck, UserPlus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import Spinner from '../common/Spinner';
import userService, { User } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialType?: 'followers' | 'following';
  userName?: string;
  onUpdate?: () => void;
}

export default function FollowListModal({
  isOpen,
  onClose,
  userId,
  initialType = 'following',
  userName,
  onUpdate
}: FollowListModalProps) {
  const { user: currentUser } = useAuth();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialType);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType, isOpen]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchList = async () => {
      setIsLoading(true);
      try {
        let data: User[] = [];
        if (activeTab === 'followers') {
          data = await userService.getFollowers(userId);
        } else {
          data = await userService.getFollowing(userId);
        }
        setUsers(Array.isArray(data) ? data : []);

        // Initialize follow status relative to current logged-in user
        const map: Record<string, boolean> = {};
        const myFollowing = (currentUser as any)?.following || [];
        (Array.isArray(data) ? data : []).forEach((u) => {
          const uId = u._id || (u as any).id;
          if (uId) {
            map[uId] = myFollowing.includes(uId);
          }
        });
        setFollowingMap(map);
      } catch (error) {
        console.error('Failed to load follow list:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [isOpen, userId, activeTab, currentUser]);

  const handleToggleFollow = async (targetUserId: string) => {
    if (!currentUser) return;
    const isCurrentlyFollowing = !!followingMap[targetUserId];

    // Optimistic toggle
    setFollowingMap((prev) => ({ ...prev, [targetUserId]: !isCurrentlyFollowing }));

    try {
      if (isCurrentlyFollowing) {
        await userService.unfollowUser(targetUserId);
      } else {
        await userService.followUser(targetUserId);
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to toggle follow status:', err);
      // Revert on error
      setFollowingMap((prev) => ({ ...prev, [targetUserId]: isCurrentlyFollowing }));
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (u.fullName || '').toLowerCase().includes(q);
    const userMatch = (u.username || '').toLowerCase().includes(q);
    return nameMatch || userMatch;
  });

  const currentLoggedInId = currentUser?.id || currentUser?._id;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh] z-10"
      >
        {/* Header with Tabs */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'followers'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t('profile.followers') || 'Followers'}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'following'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t('profile.following') || 'Following'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={isRTL ? 'بحث بالاسم أو اسم المستخدم...' : 'Search people...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-2 ps-10 pe-4 text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-gray-100 dark:divide-gray-800/60">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Spinner size="md" />
              <span className="text-xs text-gray-400 font-semibold">{t('common.loading') || 'Loading...'}</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold">
                {searchQuery
                  ? (isRTL ? 'لا توجد نتائج مطابقة' : 'No users match your search')
                  : activeTab === 'following'
                  ? (isRTL ? 'لا يتابع أحداً بعد' : 'Not following anyone yet')
                  : (isRTL ? 'لا يوجد متابعون بعد' : 'No followers yet')}
              </p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const uId = u._id || (u as any).id;
              const isMe = String(uId) === String(currentLoggedInId);
              const isFollowing = !!followingMap[uId];

              return (
                <div
                  key={uId}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-3"
                >
                  <Link
                    href={`/profile/${uId}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <Avatar src={u.avatar || (u as any).avatarUrl} alt={u.username} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
                        {u.fullName || u.username}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        @{u.username}
                      </p>
                      {u.bio && (
                        <p className="text-[10px] text-gray-400 truncate line-clamp-1 mt-0.5">
                          {u.bio}
                        </p>
                      )}
                    </div>
                  </Link>

                  {!isMe && currentUser && (
                    <button
                      onClick={() => handleToggleFollow(uId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                        isFollowing
                          ? 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                          : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{t('profile.following') || 'Following'}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t('profile.follow') || 'Follow'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
