"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Check } from 'lucide-react';
import Button from '../common/Button';

interface JoinButtonProps {
  communityId: string;
  isMember?: boolean;
  memberCount?: number;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  variant?: 'default' | 'compact';
}

export default function JoinButton({
  communityId,
  isMember = false,
  memberCount = 0,
  onJoin,
  onLeave,
  variant = 'default',
}: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(isMember);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMemberCount, setCurrentMemberCount] = useState(memberCount);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      if (isJoined) {
        await onLeave?.(communityId);
        setIsJoined(false);
        setCurrentMemberCount(prev => Math.max(0, prev - 1));
      } else {
        await onJoin?.(communityId);
        setIsJoined(true);
        setCurrentMemberCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle membership:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
          isJoined
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isJoined ? (
          <>
            <Check className="w-4 h-4" />
            Joined
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Join
          </>
        )}
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleClick}
        isLoading={isLoading}
        variant={isJoined ? 'secondary' : 'primary'}
        className="flex items-center gap-2"
      >
        {isJoined ? (
          <>
            <UserMinus className="w-4 h-4" />
            Leave Community
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Join Community
          </>
        )}
      </Button>

      {currentMemberCount > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentMemberCount.toLocaleString()} {currentMemberCount === 1 ? 'member' : 'members'}
        </span>
      )}
    </div>
  );
}
