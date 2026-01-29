"use client";

import React, { useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, Zap, Target, BarChart3, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Badge from '../common/Badge';
import businessService from '@/services/businessService';

interface HealthData {
  reputationScore: number;
  reputationHistory: Array<{ score: number; reason: string; date: string }>;
  metrics: {
    professionalism: number;
    sentiment: string;
    trust: number;
    innovation: number;
    engagement: number;
  };
  topKeywords: string[];
  totalReach: number;
}

export default function BusinessHealthCard({ businessId }: { businessId: string }) {
  const [data, setData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await businessService.getHealth(businessId);
        setData(data);
      } catch (error) {
        console.error('Failed to fetch business health:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHealth();
  }, [businessId]);

  if (isLoading) return (
    <Card className="p-8 flex flex-col items-center justify-center gap-4">
      <Spinner size="md" />
      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Calculating Health Pulse...</span>
    </Card>
  );

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-500';
    if (score >= 50) return 'text-primary-500';
    return 'text-orange-500';
  };

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight">Business Integrity</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">AI Audit Protocol v1.0</p>
            </div>
          </div>
          <Badge className="bg-white/10 text-white border-none py-1 px-3 rounded-full text-[10px] font-black">LIVE</Badge>
        </div>

        <div className="flex items-end gap-4">
          <div className="text-6xl font-black tracking-tighter">
            {data.reputationScore}
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-1 text-success-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Rise</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Reputation Score</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <MetricBox 
          icon={<Zap className="w-4 h-4 text-yellow-500" />} 
          label="Professionalism" 
          value={`${data.metrics.professionalism}%`} 
          color={getScoreColor(data.metrics.professionalism)}
        />
        <MetricBox 
          icon={<Target className="w-4 h-4 text-primary-500" />} 
          label="Trust Score" 
          value={`${data.metrics.trust}%`} 
          color={getScoreColor(data.metrics.trust)}
        />
        <MetricBox 
          icon={<BarChart3 className="w-4 h-4 text-secondary-500" />} 
          label="Engagement" 
          value={`${data.metrics.engagement}%`} 
          color="text-secondary-500"
        />
        <MetricBox 
          icon={<TrendingUp className="w-4 h-4 text-success-500" />} 
          label="Sentiment" 
          value={data.metrics.sentiment} 
          color="text-success-500"
        />
      </div>

      {/* Keywords Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content DNA</span>
          <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {data.topKeywords.map(keyword => (
            <span key={keyword} className="px-2.5 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Activity Mini-Feed */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
          Recent Reputation Events
          <Info className="w-3 h-3 opacity-50" />
        </h3>
        <div className="space-y-3">
          {data.reputationHistory.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">{event.reason}</p>
                <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function MetricBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-500/30 group">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors">{label}</span>
      </div>
      <div className={`text-lg font-black tracking-tight ${color}`}>
        {value}
      </div>
    </div>
  );
}
