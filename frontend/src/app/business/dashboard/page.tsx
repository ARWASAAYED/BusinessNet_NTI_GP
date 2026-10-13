"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  Megaphone,
  ChevronRight,
  Filter,
  Download,
  Calendar,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import businessService from '@/services/businessService';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filterMetric, setFilterMetric] = useState<'views' | 'upvotes' | 'recent' | 'trending'>('views');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const businessId = user?.businessId;

  const fetchData = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(false);
    try {
      const [stats, posts] = await Promise.all([
        businessService.getAnalytics(businessId),
        businessService.getPostPerformance(businessId)
      ]);
      setAnalytics(stats);
      setPerformance(posts);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const sortedPerformance = useMemo(() => {
    const list = [...performance];
    if (filterMetric === 'views') {
      return list.sort((a, b) => (b.impressions || 0) - (a.impressions || 0));
    }

    if (filterMetric === 'upvotes') {
      return list.sort((a, b) => (b.upvotesCount || 0) - (a.upvotesCount || 0));
    }
    if (filterMetric === 'trending') {
      return list.filter((p) => p.isTrending || p.isPromoted);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [performance, filterMetric]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-500 animate-pulse">{t('dashboard.calculating')}</p>
      </div>
    );
  }

  if (!businessId) {
    // Personal user: show personal analytics stub with upgrade prompt
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-10 space-y-8">
        {/* Personal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                {isRTL ? 'حساب شخصي' : 'Personal Account'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {isRTL ? `مرحباً، ${user?.username} 👋` : `Hello, ${user?.username} 👋`}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isRTL ? 'ملخص نشاطك على المنصة' : 'Your activity summary on the platform'}
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/business'}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black shadow-lg shadow-primary-500/20 shrink-0"
          >
            <Target className="w-4 h-4" />
            {isRTL ? 'ترقية لحساب أعمال' : 'Upgrade to Business'}
          </Button>
        </div>

        {/* Personal stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: isRTL ? 'منشوراتي' : 'My Posts', value: '—', icon: <BarChart3 className="w-5 h-5" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
            { label: isRTL ? 'المتابعون' : 'Followers', value: '—', icon: <Users className="w-5 h-5" />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
            { label: isRTL ? 'أكثر مشاهدة' : 'Top Post Views', value: '—', icon: <Eye className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary-500 to-indigo-600 border-none text-white text-center space-y-4">
          <Target className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-xl font-black">{t('dashboard.setupRequired')}</h2>
          <p className="opacity-80 text-sm max-w-sm mx-auto">{t('dashboard.setupDesc')}</p>
          <Button
            onClick={() => window.location.href = '/business'}
            className="bg-white text-primary-700 hover:bg-gray-100 font-black rounded-xl px-8 py-3 mx-auto"
          >
            {t('dashboard.linkBusiness')}
          </Button>
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{t('dashboard.loadFailed')}</p>
          <Button onClick={() => void fetchData()} className="w-full rounded-2xl py-3">
            {t('common.retry')}
          </Button>
        </Card>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    subtext,
    icon,
  }: {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ReactNode;
  }) => (
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
      </div>
    </motion.div>
  );

  const handleExport = () => {
    if (!analytics || !performance) return;

    // Prepare overview data
    const overview = [
      ['Metric', 'Value'],
      ['Total Impressions', analytics.totalImpressions],
      ['Total Upvotes', analytics.totalUpvotes],
      ['Followers Count', analytics.followersCount],
      ['Reputation Score', analytics.reputationScore],
      ['Active Campaigns', analytics?.activeCampaigns || 0],
      ['Total Promo Impressions', analytics?.totalPromoImpressions || 0],
      ['Total Spent', analytics?.totalSpent || 0],
      ['Total Clicks', analytics?.totalClicks || 0],
    ];

    // Prepare performance data
    const perfRows = performance.map(post => [
      `"${post.content.replace(/"/g, '""')}"`, // Quote strings for CSV safety
      new Date(post.createdAt).toLocaleDateString(),
      post.impressions || 0,
      post.upvotesCount || 0,
      post.isTrending ? 'Yes' : 'No'
    ]);

    const perfHeader = ['Content', 'Date', 'Impressions', 'Upvotes', 'Trending'];

    // Combine into CSV
    let csvContent = 'BUSINESS OVERVIEW\n';
    overview.forEach(row => { csvContent += row.join(',') + '\n'; });
    csvContent += '\nCONTENT PERFORMANCE\n';
    csvContent += perfHeader.join(',') + '\n';
    perfRows.forEach(row => { csvContent += row.join(',') + '\n'; });

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `business_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const campaignCtr = analytics?.totalPromoImpressions > 0
    ? (analytics.totalClicks / analytics.totalPromoImpressions) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-success-500/10 text-success-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
              {t('dashboard.realtime')}
            </span>
            <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {t('dashboard.intel')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">{t('dashboard.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all">
            <Calendar className="w-4 h-4" />
            {t('dashboard.last30')}
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20"
          >
            <Download className="w-4 h-4" />
            {t('dashboard.export')}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-8">
        <StatCard 
          title={t('dashboard.impressions')} 
          value={analytics?.totalImpressions?.toLocaleString() || 0}
          subtext={t('dashboard.impressionsSub')}
          icon={<Eye className="w-6 h-6" />}
        />
        <StatCard 
          title={t('dashboard.uniqueReach')} 
          value={analytics?.totalUniqueViews?.toLocaleString() || 0}
          subtext={t('dashboard.uniqueReachSub')}
          icon={<Users className="w-6 h-6" />}
        />
         <StatCard 
          title={t('dashboard.engagement')} 
          value={analytics?.totalUpvotes || 0}
          subtext={t('dashboard.engagementSub')}
          icon={<TrendingUp className="w-6 h-6" />}
        />
         <StatCard 
          title={t('dashboard.networkReach')} 
          value={analytics?.followersCount || 0}
          subtext={t('dashboard.networkReachSub')}
          icon={<Users className="w-6 h-6" />}
        />
         <StatCard 
          title={t('dashboard.marketTrust')} 
          value={`${analytics?.reputationScore || 0}%`}
          subtext={t('dashboard.marketTrustSub')}
          icon={<Target className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Performance Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-8 relative">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">{t('dashboard.topContent')}</h2>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
                    showFilterMenu 
                      ? 'bg-primary-50 dark:bg-primary-950/50 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-500'
                  }`}
                  title={isRTL ? 'تصفية وترتيب المحتوى' : 'Filter & Sort Content'}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-xs font-bold capitalize hidden sm:inline">
                    {filterMetric === 'views' && (isRTL ? 'الأكثر مشاهدة' : 'Most Views')}
                    {filterMetric === 'upvotes' && (isRTL ? 'الأعلى تصويتاً' : 'Top Upvoted')}
                    {filterMetric === 'trending' && (isRTL ? 'المروج والترند' : 'Trending / Promoted')}
                    {filterMetric === 'recent' && (isRTL ? 'الأحدث' : 'Most Recent')}
                  </span>
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowFilterMenu(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute end-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-40 space-y-1"
                      >
                        {[
                          { id: 'views', label: isRTL ? 'الأكثر مشاهدة' : 'Most Views (Impressions)' },
                          { id: 'upvotes', label: isRTL ? 'الأعلى تفاعلاً وتصويتاً' : 'Most Upvotes' },
                          { id: 'trending', label: isRTL ? 'المروج والترند فقط' : 'Promoted & Trending' },
                          { id: 'recent', label: isRTL ? 'الأحدث نشراً' : 'Most Recent' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setFilterMetric(opt.id as any);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                              filterMetric === opt.id
                                ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {filterMetric === opt.id && <Check className="w-3.5 h-3.5 text-primary-600" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              {sortedPerformance.length > 0 ? (
                sortedPerformance.map((post, idx) => (
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
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {t('dashboard.shared', { date: new Date(post.createdAt).toLocaleDateString() })}
                      </p>
                    </div>
                    <div className="flex items-center gap-8 ml-auto">
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900 dark:text-gray-100">{post.impressions?.toLocaleString()}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{t('dashboard.views')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-primary-500">{post.upvotesCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{t('dashboard.upvotes')}</p>
                      </div>
                      {post.isTrending && (
                         <div className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-bounce">
                           {t('dashboard.trending')}
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
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.noData')}</p>
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
              {t('dashboard.liveReach')}
            </h3>
            
            <div className="space-y-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-1">{t('dashboard.promoViews')}</p>
                  <p className="text-4xl font-black">{analytics?.totalPromoImpressions?.toLocaleString() || 0}</p>
                </div>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full flex items-center justify-center font-black text-sm">
                  {analytics?.activeCampaigns || 0}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-100">{t('dashboard.ctr')}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-100">
                    {campaignCtr.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full"
                    style={{ width: `${Math.min(100, Math.max(0, campaignCtr))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">{t('dashboard.totalSpent')}</p>
                    <p className="font-black text-lg">${analytics?.totalSpent || 0}</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200 mb-1">{t('dashboard.totalClicks')}</p>
                    <p className="font-black text-lg">{analytics?.totalClicks || 0}</p>
                 </div>
              </div>

              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/promotions'}
                className="w-full rounded-2xl py-4 font-black shadow-lg bg-white/10 hover:bg-white/20 text-white border-none"
              >
                {t('dashboard.manageCampaigns')}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
