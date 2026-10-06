"use client";

import React from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface OnlineStatusProps {
  isOnline: boolean;
  showText?: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, showText = true }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'
        }`}
      />
      {showText && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {isOnline ? t('messages.online') : t('messages.offline')}
        </span>
      )}
    </div>
  );
};

export default OnlineStatus;
