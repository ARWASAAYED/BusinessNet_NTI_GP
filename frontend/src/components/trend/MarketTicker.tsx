"use client";

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import trendService, { TrendingTopic } from '@/services/trendService';

export default function MarketTicker() {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await trendService.getTrendingTopics();
        setTrends(data);
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      }
    };
    fetchTrends();
    const interval = setInterval(fetchTrends, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (trends.length === 0) return null;

  // Duplicate trends to create seamless loop
  const tickerItems = [...trends, ...trends, ...trends];

  return (
    <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-2 overflow-hidden relative z-40 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20" />
      
      <div className="shrink-0 px-4 border-r border-gray-100 dark:border-gray-800 flex items-center gap-2 z-30 bg-white dark:bg-gray-950">
         <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Pulse</span>
      </div>

      <motion.div 
        className="flex items-center gap-12 whitespace-nowrap pl-6"
        animate={{ x: [0, -2000] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {tickerItems.map((topic, i) => (
          <div key={`${topic.name}-${i}`} className="flex items-center gap-3 group/item">
             <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                {topic.growth !== undefined && topic.growth > 10 && (
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-bounce" />
                )}
                <span className="text-gray-400 group-hover/item:text-primary-500 transition-colors">#</span>
                <span className="text-gray-900 dark:text-gray-100">{topic.name}</span>
                <span className="text-[10px] opacity-60">
                   {topic.count > 50 ? '🔥' : topic.count > 20 ? '🌤️' : '❄️'}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 tabular-nums">
                   {topic.count > 1000 ? `${(topic.count / 1000).toFixed(1)}k` : topic.count}
                </span>
                {topic.growth !== undefined && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-black ${
                    topic.growth >= 0 ? 'text-success-500' : 'text-error-500'
                  }`}>
                    {topic.growth >= 0 ? '▲' : '▼'} {Math.abs(topic.growth)}%
                  </div>
                )}
             </div>
             <div className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
