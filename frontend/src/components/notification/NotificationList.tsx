"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import notificationService, { Notification } from '@/services/notificationService';

import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/components/layout/LanguageProvider';

import Link from 'next/link';

interface NotificationListProps {
  onClose?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    loadNotifications 
  } = useNotifications();
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Header dropdown only displays 1 notification as requested
  const displayedNotifications = notifications.slice(0, 1);

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('notifications.title')}</h2>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs px-2 py-1 h-auto"
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="text-center py-8 px-4">
            <p className="text-red-500 text-xs mb-3">{error}</p>
            <button
              onClick={loadNotifications}
              className="text-primary-600 hover:text-primary-700 text-xs font-semibold"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-500">
            <p className="text-sm font-semibold mb-1">{t('notifications.noNotifications')}</p>
            <p className="text-xs text-gray-400">{t('notifications.allCaughtUp')}</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onClick={onClose}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer - Link to full notification page */}
      <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline block py-1"
        >
          {t('notifications.viewAll')} →
        </Link>
      </div>
    </div>
  );
};

export default NotificationList;
