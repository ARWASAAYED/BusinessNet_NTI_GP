"use client";

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

export default function AnalyticsDashboard() {
  const stats = [
    { label: 'Total Impressions', value: '45,231', change: '+12.5%', isUp: true, icon: Eye, color: 'text-blue-500' },
    { label: 'Link Clicks', value: '1,284', change: '+8.2%', isUp: true, icon: MousePointer2, color: 'text-purple-500' },
    { label: 'Engagement Rate', value: '4.8%', change: '-0.3%', isUp: false, icon: TrendingUp, color: 'text-green-500' },
    { label: 'New Followers', value: '156', change: '+24.1%', isUp: true, icon: Users, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary-500" />
          Campaign Analytics
        </h2>
        <div className="flex gap-2">
          <select className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 hover:border-primary-500/50 transition-all cursor-default group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'} px-2 py-1 rounded-full`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-[300px] flex flex-col justify-between">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Reach Distribution</h3>
          <div className="flex-1 flex items-end gap-2 pt-8">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-gradient-to-t from-primary-600 to-indigo-400 rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </Card>

        <Card className="p-6 h-[300px] flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-8">Audience Demographics</h3>
          <div className="space-y-6">
            {[
              { label: 'Technology', val: 75 },
              { label: 'Finance', val: 45 },
              { label: 'Marketing', val: 60 },
              { label: 'Design', val: 30 },
            ].map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-900 dark:text-gray-100">{d.label}</span>
                  <span className="text-primary-600">{d.val}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${d.val}%` }}
                    className="h-full bg-primary-500 rounded-full" 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
