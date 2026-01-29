"use client";

import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';

export interface Trend {
  _id: string;
  keyword: string;
  category: string;
  velocity: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  postCount: number;
  growthRate: number;
}

interface TrendCardProps {
  trend: Trend;
  onClick?: () => void;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
    case 'negative':
      return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default function TrendCard({ trend, onClick }: TrendCardProps) {
  const isGrowing = trend.growthRate > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {trend.keyword}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {trend.category}
              </p>
            </div>
          </div>
          
          <Badge 
            variant="custom" 
            className={getSentimentColor(trend.sentiment)}
          >
            {trend.sentiment}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Posts</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {trend.postCount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Velocity</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {trend.velocity.toFixed(1)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Growth</p>
            <div className="flex items-center gap-1">
              {isGrowing ? (
                <ArrowUp className="w-4 h-4 text-success-600 dark:text-success-400" />
              ) : (
                <ArrowDown className="w-4 h-4 text-error-600 dark:text-error-400" />
              )}
              <p className={`text-lg font-bold ${
                isGrowing 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'
              }`}>
                {Math.abs(trend.growthRate).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
