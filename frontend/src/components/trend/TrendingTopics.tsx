"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import trendService, { TrendingTopic } from '@/services/trendService';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Badge from '../common/Badge';

export default function TrendingTopics() {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Business', 'Finance', 'Design'];

  useEffect(() => {
    const loadTrends = async () => {
      setIsLoading(true);
      try {
        const data = await trendService.getTrendingTopics(selectedCategory);
        setTrends(data);
      } catch (error) {
        console.error('Failed to load trends:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrends();
  }, [selectedCategory]);

  return (
    <Card className="p-5 overflow-hidden border-none shadow-xl bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/40">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h2 className="font-black text-gray-900 dark:text-gray-100 tracking-tight">Trending Now</h2>
        </div>
        <button 
          onClick={() => window.location.href = '/trending'}
          className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Spinner size="sm" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">Analyzing Pulse...</span>
        </div>
      ) : (
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {trends.map((tag, index) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
                className={`flex flex-col gap-1 p-3 rounded-xl transition-all cursor-pointer group relative ${
                  tag.isPromoted 
                    ? 'bg-primary-50/30 dark:bg-primary-900/5 border border-primary-100/50 dark:border-primary-800/30' 
                    : ''
                }`}
                onClick={() => window.location.href = `/search?q=${encodeURIComponent('#' + tag.name)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold transition-colors ${
                      tag.isPromoted 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }`}>
                      #{tag.name}
                    </span>
                    {tag.isPromoted && (
                      <Badge variant="custom" className="bg-primary-500 text-white text-[8px] py-0.5 px-1.5 h-auto font-black uppercase border-none">
                        {tag.promotionLabel || 'AD'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {tag.growth !== undefined && (
                      <div className={`flex items-center text-[10px] font-bold ${tag.growth >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                        {tag.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(tag.growth)}%
                      </div>
                    )}
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tabular-nums">
                      {(tag.count / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
                
                {tag.isPromoted ? (
                  <p className="text-[10px] text-primary-600/60 dark:text-primary-400/60 font-medium">
                    Promoted by Partner
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((tag.count / 600) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
