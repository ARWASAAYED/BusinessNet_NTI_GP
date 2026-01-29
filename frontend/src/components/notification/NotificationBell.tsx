"use client";

import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, onClick }) => {
  const hasNotifications = count > 0;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Notifications"
    >
      <Bell className={`w-6 h-6 transition-colors ${
        hasNotifications 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
      }`} />
      
      {hasNotifications && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <Badge variant="danger" size="sm" className="min-w-[20px] h-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </Badge>
        </motion.div>
      )}
    </motion.button>
  );
};

export default NotificationBell;
