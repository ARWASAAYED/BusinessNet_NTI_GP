"use client";

import React from 'react';
import { Newspaper, Bell, Sparkles, Swords, ArrowRight, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { useLanguage } from '@/components/layout/LanguageProvider';

const articles = [
  {
    category: "Platform Update",
    title: "Introducing Industry Battles: The Future of Professional Debate",
    excerpt: "Engage in high-stakes professional duels, prove your expertise, and climb the global reputation leaderboard with our new Battle system.",
    date: "Jan 29, 2026",
    image: "⚔️",
    icon: <Swords className="w-5 h-5 text-primary-500" />,
    color: "bg-primary-500/10"
  },
  {
    category: "AI Insights",
    title: "AI Analysis V2: Sentiment & Professional Scoring",
    excerpt: "Our upgraded AI engine now analyzes the professional sentiment and impact of every post, providing deeper insights for business growth.",
    date: "Jan 25, 2026",
    image: "🤖",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    color: "bg-amber-500/10"
  },
  {
    category: "Network Growth",
    title: "The Badge System: Rewarding Connection Excellence",
    excerpt: "New automated badges are now live! Earn status by engaging with the community and scaling your business presence.",
    date: "Jan 20, 2026",
    image: "🏆",
    icon: <Star className="w-5 h-5 text-indigo-500" />,
    color: "bg-indigo-500/10"
  }
];

export default function NewsPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/20">
             <Newspaper className="w-6 h-6" />
           </div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('news.title')}</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
          {t('news.subtitle')}
        </p>
      </div>

      <div className="grid gap-8">
        {articles.map((article, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all group p-0">
               <div className="flex flex-col md:flex-row">
                 <div className={`md:w-48 flex items-center justify-center text-6xl ${article.color} border-e border-gray-100 dark:border-gray-800`}>
                   {article.image}
                 </div>
                 <div className="p-8 flex-1">
                   <div className="flex items-center justify-between mb-4">
                     <Badge className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-none font-bold">
                       {article.category}
                     </Badge>
                     <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                       <Clock className="w-3 h-3" />
                       {article.date}
                     </div>
                   </div>
                   <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                     {article.title}
                   </h2>
                   <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed font-medium">
                     {article.excerpt}
                   </p>
                   <button className="flex items-center gap-2 text-sm font-black text-primary-600 hover:gap-3 transition-all uppercase tracking-widest">
                     <span>{t('news.readMore')}</span>
                     <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center relative overflow-hidden">
        <div className="absolute top-0 end-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px]" />
        <h2 className="text-3xl font-black text-white mb-4 relative z-10">{t('news.subscribe')}</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10">{t('news.subscribeDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="your@business.com" 
            className="px-6 py-4 bg-gray-800 border-none rounded-2xl text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
          />
          <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-500/20 active:scale-95">
            {t('news.subscribe')}
          </button>
        </div>
      </div>
    </div>
  );
}
