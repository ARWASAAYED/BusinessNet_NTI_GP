"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, MousePointer2, Target, DollarSign, BarChart2 } from 'lucide-react';
import promotionService, { PromotionAnalytics } from '@/services/promotionService';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

interface PromotionAnalyticsModalProps {
  promotionId: string;
  onClose: () => void;
}

export default function PromotionAnalyticsModal({ promotionId, onClose }: PromotionAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<PromotionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await promotionService.getPromotionAnalytics(promotionId);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [promotionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Campaign Performance</h3>
              <p className="text-xs text-gray-500 font-medium">Real-time engagement metrics</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner size="lg" />
              <p className="text-gray-500 text-sm font-medium animate-pulse">Aggregating data points...</p>
            </div>
          ) : analytics ? (
            <div className="space-y-8">
              {/* Primary Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  label="Impressions" 
                  value={analytics.impressions.toLocaleString()} 
                  icon={<Target className="w-4 h-4" />} 
                  color="text-indigo-500"
                />
                <StatCard 
                  label="Clicks" 
                  value={analytics.clicks.toLocaleString()} 
                  icon={<MousePointer2 className="w-4 h-4" />} 
                  color="text-primary-500"
                />
                <StatCard 
                  label="CTR" 
                  value={`${analytics.ctr}%`} 
                  icon={<TrendingUp className="w-4 h-4" />} 
                  color="text-emerald-500"
                />
                <StatCard 
                  label="ROI" 
                  value={`${analytics.roi}x`} 
                  icon={<Users className="w-4 h-4" />} 
                  color="text-amber-500"
                />
              </div>

              {/* Budget Progress */}
              <Card className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-dashed">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Budget Utilization
                  </h4>
                  <span className="text-sm font-black text-emerald-500">
                    ${analytics.spent} / ${analytics.spent + analytics.remaining}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(analytics.spent / (analytics.spent + analytics.remaining)) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Spent</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Remaining</p>
                </div>
              </Card>

              {/* Conversion Metric */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-primary-500/20 bg-primary-50/30 dark:bg-primary-900/10">
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase mb-2">Total Conversions</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-gray-100">{analytics.conversions}</span>
                    <span className="text-xs text-emerald-500 font-bold mb-1">+5% vs avg</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-900/10">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-2">Cost Per Click</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-gray-100">${(analytics.spent / (analytics.clicks || 1)).toFixed(2)}</span>
                    <span className="text-xs text-emerald-500 font-bold mb-1">-2% healthy</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No data available for this campaign yet.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Close Insight
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-white/5">
      <div className={`p-1.5 w-fit rounded-lg ${color} bg-current/10 mb-3`}>
        {icon}
      </div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
