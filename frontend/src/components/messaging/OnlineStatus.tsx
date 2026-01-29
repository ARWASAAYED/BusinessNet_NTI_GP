"use client";

import React from 'react';

interface OnlineStatusProps {
  isOnline: boolean;
  showText?: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, showText = true }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      {showText && (
        <span className="text-xs text-gray-500">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
};

export default OnlineStatus;
