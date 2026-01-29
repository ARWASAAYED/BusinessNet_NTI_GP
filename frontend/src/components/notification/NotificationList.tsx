"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import notificationService, { Notification } from '@/services/notificationService';

import { useNotifications } from '@/hooks/useNotifications';

interface NotificationListProps {
  onClose?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
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

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadNotifications}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
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
    </div>
  );
};

export default NotificationList;
