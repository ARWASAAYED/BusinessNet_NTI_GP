"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  Megaphone,
  ChevronRight,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import businessService from '@/services/businessService';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const businessId = user?.businessId;

  useEffect(() => {
    if (businessId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [stats, posts] = await Promise.all([
            businessService.getAnalytics(businessId),
            businessService.getPostPerformance(businessId)
          ]);
          setAnalytics(stats);
          setPerformance(posts);
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-500 animate-pulse">Calculating Intelligence...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto text-primary-600">
            <Target className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Setup Required</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Please link a business account to access real-time professional analytics.</p>
          <Button onClick={() => window.location.href = '/business'} className="w-full rounded-2xl py-4">Link Business</Button>
        </Card>
      </div>
    );
  }

  const StatCard = ({ title, value, subtext, icon, trend, trendValue }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl transition-all group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl">
          {icon}
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-gray-400">{title}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{value}</h3>
          <p className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-tight">{subtext}</p>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black ${
            trend === 'up' ? 'bg-success-100 text-success-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}%
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-success-500/10 text-success-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
              Real-time Analysis
            </span>
            <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              Business Intelligence
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Business Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Strategic insights for your professional network presence.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-primary-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Impressions" 
          value={analytics?.totalImpressions?.toLocaleString() || 0}
          subtext="Total content visibility"
          icon={<Eye className="w-6 h-6" />}
          trend="up"
          trendValue={12.5}
        />
         <StatCard 
          title="Engagement" 
          value={analytics?.totalUpvotes || 0}
          subtext="Professional upvotes"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
          trendValue={8.2}
        />
         <StatCard 
          title="Network Reach" 
          value={analytics?.followersCount || 0}
          subtext="Total unique followers"
          icon={<Users className="w-6 h-6" />}
          trend="up"
          trendValue={4.1}
        />
         <StatCard 
          title="Market Trust" 
          value={`${analytics?.reputationScore || 0}%`}
          subtext="Verified business score"
          icon={<Target className="w-6 h-6" />}
          trend="up"
          trendValue={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Performance Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Top Content Performance</h2>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {performance.length > 0 ? (
                performance.map((post, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={post._id}
                    className="flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all flex-wrap sm:flex-nowrap"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{post.content}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shared {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-8 ml-auto">
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900 dark:text-gray-100">{post.impressions?.toLocaleString()}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-primary-500">{post.upvotesCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Upvotes</p>
                      </div>
                      {post.isTrending && (
                         <div className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-bounce">
                           Trending
                         </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto opacity-50">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No detailed performance data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Promotion Analytics & Intelligence */}
        <div className="lg:col-span-4 space-y-8">
          {/* Active Promotions */}
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Megaphone className="w-6 h-6" />
              Live Promotion Reach
            </h3>
            
            <div className="space-y-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-1">Total Promotion Views</p>
                  <p className="text-4xl font-black">{analytics?.totalPromoImpressions?.toLocaleString() || 0}</p>
                </div>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full flex items-center justify-center font-black text-sm">
                  {analytics?.activeCampaigns || 0}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Click Through Rate</span>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-100">8.4%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="w-[84%] bg-white h-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">Total Spent</p>
                    <p className="font-black text-lg">${analytics?.totalSpent || 0}</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">Total Clicks</p>
                    <p className="font-black text-lg">{analytics?.totalClicks || 0}</p>
                 </div>
              </div>

              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/promotions'}
                className="w-full rounded-2xl py-4 font-black shadow-lg bg-white/10 hover:bg-white/20 text-white border-none"
              >
                Manage Campaigns
              </Button>
            </div>
          </div>

          {/* AI Intelligence Tips */}
          <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <TrendingUp className="w-12 h-12 text-primary-500" />
             </div>
             <h3 className="text-lg font-black mb-6 flex items-center gap-3">
               💡 Network Intelligence
             </h3>
             <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    🔥
                  </div>
                  <div>
                    <p className="text-sm font-bold">Post at 2 PM for 30% more reach</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">AI Prediction</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    📈
                  </div>
                  <div>
                    <p className="text-sm font-bold">Tech posts are trending in NY</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Global Trend</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <div>
                    <p className="text-sm font-bold">Update profile to boost trust</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Smart Tip</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
