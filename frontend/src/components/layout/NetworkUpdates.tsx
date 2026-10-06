"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Bell, Sparkles, Swords, TrendingUp, X } from 'lucide-react';
import Card from '../common/Card';
import { useLanguage } from './LanguageProvider';

export default function NetworkUpdates() {
  const { t } = useLanguage();
  const [showChangelogModal, setShowChangelogModal] = useState(false);

  const updates = [
    {
      icon: <Swords className="w-4 h-4 text-primary-500" />,
      title: t('news.industryBattles') || "Industry Battles Live",
      description: t('news.industryBattlesDesc') || "Challenge professionals and dominate the leaderboard.",
      tag: "NEW",
      href: "/battles"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
      title: t('news.audienceAnalytics') || "Audience Analytics",
      description: t('news.audienceAnalyticsDesc') || "Get deeper reach and impression metrics on your posts.",
      tag: "UPDATE",
      href: "/dashboard"
    },
    {
      icon: <Bell className="w-4 h-4 text-indigo-500" />,
      title: t('news.realtimePulse') || "Real-time Pulse",
      description: t('news.realtimePulseDesc') || "Never miss a trending keyword in your industry.",
      tag: "LIVE",
      href: "/trending"
    }
  ];

  const changelogHistory = [
    { version: "v2.4.0", date: "October 2026", items: ["Industry Skill Battles arena", "Smart Promotion Engine", "Real-time Pulse Analytics"] },
    { version: "v2.3.0", date: "September 2026", items: ["Multi-language Arabic/English support", "Business Verification Badges", "Community chat & channels"] },
    { version: "v2.0.0", date: "August 2026", items: ["Platform launch with verified business directory", "Smart hashtag trends"] }
  ];

  return (
    <>
      <Card className="p-6 bg-white dark:bg-gray-950 border-none shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
            <Newspaper className="w-5 h-5" />
          </div>
          <h2 className="font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {t('news.platformNews') || 'Platform News'}
          </h2>
        </div>

        <div className="space-y-4">
          {updates.map((update, i) => (
            <Link key={i} href={update.href} className="group block">
              <div className="flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="mt-1">{update.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                      {update.title}
                    </h3>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                      {update.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {update.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => setShowChangelogModal(true)}
          className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-600 text-center transition-colors border-t border-gray-100 dark:border-gray-800"
        >
          {t('news.viewChangelog') || 'View Full Changelog'}
        </button>
      </Card>

      {/* Changelog Modal */}
      {showChangelogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">
                  {t('news.changelogTitle') || 'Platform Changelog'}
                </h3>
              </div>
              <button 
                onClick={() => setShowChangelogModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4 max-h-80 overflow-y-auto">
              {changelogHistory.map((ch, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-primary-600 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">{ch.version}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{ch.date}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {ch.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowChangelogModal(false)}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {t('common.close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
