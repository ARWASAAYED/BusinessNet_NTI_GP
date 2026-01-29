"use client";

import React from 'react';
import { Users, FileText, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface BusinessStatsProps {
  followers: number;
  posts: number;
  engagementRate: number;
  reputationScore: number;
  verified?: boolean;
}

export default function BusinessStats({
  followers,
  posts,
  engagementRate,
  reputationScore,
  verified = false,
}: BusinessStatsProps) {
  const stats = [
    {
      icon: Users,
      label: 'Followers',
      value: followers.toLocaleString(),
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: FileText,
      label: 'Posts',
      value: posts.toLocaleString(),
      color: 'text-secondary-600 dark:text-secondary-400',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/30',
    },
    {
      icon: TrendingUp,
      label: 'Engagement',
      value: `${engagementRate.toFixed(1)}%`,
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-success-100 dark:bg-success-900/30',
    },
    {
      icon: Award,
      label: 'Reputation',
      value: reputationScore.toFixed(0),
      color: 'text-warning-600 dark:text-warning-400',
      bgColor: 'bg-warning-100 dark:bg-warning-900/30',
    },
  ];

  const getReputationLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'success' };
    if (score >= 75) return { label: 'Very Good', color: 'primary' };
    if (score >= 60) return { label: 'Good', color: 'info' };
    if (score >= 40) return { label: 'Fair', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
  };

  const reputationLevel = getReputationLevel(reputationScore);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Business Statistics
        </h3>
        {verified && (
          <Badge variant="success" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            Verified
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reputation Score Bar */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reputation Level
          </span>
          <Badge variant={reputationLevel.color as any}>
            {reputationLevel.label}
          </Badge>
        </div>
        
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reputationScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              reputationScore >= 90
                ? 'bg-gradient-to-r from-success-500 to-success-600'
                : reputationScore >= 75
                ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                : reputationScore >= 60
                ? 'bg-gradient-to-r from-info-500 to-info-600'
                : reputationScore >= 40
                ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                : 'bg-gradient-to-r from-error-500 to-error-600'
            }`}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {reputationScore.toFixed(0)} / 100
          </span>
        </div>
      </div>
    </Card>
  );
}
