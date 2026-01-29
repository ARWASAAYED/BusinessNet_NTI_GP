"use client";

import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';

interface ReputationBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getReputationLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { label: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { label: 'Good', color: 'text-primary-600', bgColor: 'bg-primary-100' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  };

  const level = getReputationLevel(score);
  const fullStars = Math.floor(score / 20);
  const hasHalfStar = (score % 20) >= 10;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Star className={`${sizeClasses[size]} ${level.color} fill-current`} />
              </motion.div>
            );
          }
          if (index === fullStars && hasHalfStar) {
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StarHalf className={`${sizeClasses[size]} ${level.color} fill-current`} />
              </motion.div>
            );
          }
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} text-gray-300`}
            />
          );
        })}
      </div>

      {/* Score and Label */}
      {showLabel && (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${level.color} ${textSizeClasses[size]}`}>
            {score}
          </span>
          <Badge
            variant="custom"
            size={size}
            className={`${level.bgColor} ${level.color}`}
          >
            {level.label}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ReputationBadge;
