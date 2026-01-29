"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, Flame, Star, Zap, Globe, Cpu, Briefcase, Landmark, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/post/PostCard';
import { Post } from '@/services/postService';
import trendService, { TrendingTopic } from '@/services/trendService';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';
import TrendChart, { TrendDataPoint } from '@/components/trend/TrendChart';

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chartData, setChartData] = useState<TrendDataPoint[]>([]);

  const categories = [
    { name: 'All', icon: <Globe className="w-4 h-4" /> },
    { name: 'Technology', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Business', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Finance', icon: <Landmark className="w-4 h-4" /> },
    { name: 'Design', icon: <Palette className="w-4 h-4" /> },
  ];

  useEffect(() => {
    // Generate some mock chart data
    const mockData: TrendDataPoint[] = Array.from({ length: 14 }, (_, i) => ({
      timestamp: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 500) + 200 + (i * 20)
    }));
    setChartData(mockData);

    const loadTrendingContent = async () => {
      setIsLoading(true);
      try {
        const [postsData, topicsData] = await Promise.all([
          trendService.getTrendingPosts(1, 10, selectedCategory),
          trendService.getTrendingTopics(selectedCategory)
        ]);
        setPosts(postsData.posts || []);
        setTopics(topicsData || []);
      } catch (error) {
        console.error('Failed to load trending content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrendingContent();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header & Chart Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        <div className="xl:col-span-2 relative p-8 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-900 shadow-2xl shadow-primary-500/20 flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-none py-1.5 px-4 rounded-full font-black uppercase tracking-widest text-[10px]">
              Live Pulse Analytics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              What's Trending <span className="text-primary-300">Today</span>
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl font-medium leading-relaxed">
              Real-time insights into the most discussed professional topics and viral content across the BusinessNet ecosystem.
            </p>
          </div>
        </div>
        <div className="xl:col-span-1">
          <TrendChart 
            data={chartData} 
            title="Global Network Activity" 
            color="#6366F1"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${
              selectedCategory === cat.name 
                ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/30' 
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900/40'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content - Trending Posts */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg text-white shadow-lg shadow-orange-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Viral Content</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              Live Updates
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-6"
              >
                <Spinner size="lg" />
                <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Scraping Network Waves...</p>
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div 
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-20 text-center border-none shadow-xl bg-white dark:bg-gray-950">
                  <Globe className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Silence in the Sphere</h3>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium">No trending posts found in this category right now. Be the first to start a conversation!</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - Trending Topics */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <Card className="p-8 sticky top-24 border-none shadow-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[2rem]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-yellow-500 rounded-xl text-white shadow-lg shadow-yellow-500/20">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-black text-xl text-gray-900 dark:text-gray-100 tracking-tight">Market Buzz</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Hottest Keywords</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <div className="py-10 flex justify-center"><Spinner size="sm" /></div>
                ) : topics.map((topic, index) => (
                  <motion.div 
                    key={topic.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => window.location.href = `/search?q=${encodeURIComponent('#' + topic.name)}`}
                    className="flex items-center justify-between group cursor-pointer p-3 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-2xl transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-800/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                        index < 3 
                          ? 'bg-primary-500 text-white border-primary-400' 
                          : 'bg-white dark:bg-gray-950 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                          #{topic.name}
                        </span>
                        {topic.pulse && (
                          <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>H: <span className="text-gray-600 dark:text-gray-400 font-black">{topic.pulse.high}</span></span>
                            <span>L: <span className="text-gray-600 dark:text-gray-400 font-black">{topic.pulse.low}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                            {topic.count}
                          </span>
                          {topic.growth !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                              topic.growth >= 0 
                                ? 'bg-success-500/10 text-success-500' 
                                : 'bg-error-500/10 text-error-500'
                            }`}>
                              {topic.growth > 0 ? '▲' : '▼'} {Math.abs(topic.growth)}%
                            </span>
                          )}
                       </div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mt-1">Activity Index</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="font-black text-gray-900 dark:text-gray-100 tracking-tight text-lg">Rising Stars</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">Businesses with the highest reputation growth spikes this week across the global network.</p>
              <button 
                onClick={() => window.location.href = '/business'}
                className="w-full py-4 text-sm font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-700 rounded-2xl transition-all shadow-xl shadow-primary-500/20 active:scale-95"
              >
                Explore Top Businesses
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
