"use client";

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, AtSign, Bell, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import { Notification } from '@/services/notificationService';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClick,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-500" />;
      case 'badge':
        return <Award className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }
    onClick?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      className="dark:whileHover:bg-white/5"
    >
      <Link
        href={notification.link || '#'}
        onClick={handleClick}
        className={`block p-4 border-b border-gray-100 dark:border-gray-800 transition-colors ${
          !notification.isRead ? 'bg-primary-50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <div className="flex gap-3">
          {/* Icon or Avatar */}
          <div className="flex-shrink-0">
            {notification.sender ? (
              <div className="relative">
                <Avatar
                  src={notification.sender.avatar}
                  alt={notification.sender.username}
                  size="md"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  {getIcon()}
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {getIcon()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
              <span className="font-semibold">{notification.title}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{notification.message}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Unread Indicator */}
          {!notification.isRead && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default NotificationItem;
