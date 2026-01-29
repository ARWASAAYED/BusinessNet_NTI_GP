"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, MessageCircle, Heart, UserPlus, TrendingUp, Megaphone } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatTimeAgo } from '@/utils/dateHelpers';
import Avatar from '@/components/common/Avatar';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'like':
      case 'upvote':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'promotion':
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 rounded-2xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">Notifications</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Stay updated with your activity
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-20 text-center">
          <Bell className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No notifications yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            When you get notifications about your activity, they'll show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  notification.isRead
                    ? 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    : 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-xl ${notification.isRead ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-950'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex-1">
                        <p className={`text-sm mb-1 ${notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-white font-semibold'}`}>
                          {notification.title || notification.message}
                        </p>
                        {notification.title && notification.message && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                        )}
                      </div>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {notification.sender && (
                        <div className="flex items-center gap-2">
                          <Avatar 
                            src={notification.sender.avatar} 
                            alt={notification.sender.username} 
                            size="xs" 
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {notification.sender.username}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
