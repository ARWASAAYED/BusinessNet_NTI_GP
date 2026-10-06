"use client";

import React, { useState } from 'react';
import DuelList from '@/components/duel/DuelList';
import DuelHistory from '@/components/duel/DuelHistory';
import DuelChallengeModal from '@/components/duel/DuelChallengeModal';
import Button from '@/components/common/Button';
import { Swords, Trophy, Zap, Users, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function BattlesPage() {
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="relative mb-12 p-8 sm:p-10 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 shadow-2xl shadow-primary-500/20">
        <div className="absolute top-0 end-0 p-4 opacity-10 rotate-12 pointer-events-none">
          <Swords className="w-72 h-72 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-start">
            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-md shrink-0">
              <Swords className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight uppercase">
                {t('battles.title')}
              </h1>
              <p className="text-primary-100 font-medium max-w-lg text-sm sm:text-base leading-relaxed">
                {t('battles.subtitle')}
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
            <Button
              onClick={() => setIsChallengeModalOpen(true)}
              className="px-6 py-3.5 bg-white text-primary-700 hover:bg-gray-50 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl flex items-center gap-2.5 transition-all"
            >
              <Swords className="w-4 h-4 text-primary-600" />
              <span>{t('battles.createBattle')}</span>
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
            <Zap className="w-4 h-4 text-primary-200" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">{t('battles.activeChallenges')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
            <Users className="w-4 h-4 text-blue-200" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">{t('battles.communityVotes')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
            <Trophy className="w-4 h-4 text-emerald-300" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">{t('battles.reputationRewards')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('battles.mainEvent')}</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChallengeModalOpen(true)}
                className="hidden sm:flex items-center gap-2 font-bold text-xs rounded-xl"
              >
                <PlusCircle className="w-4 h-4 text-primary-500" />
                <span>{t('battles.issueChallenge')}</span>
              </Button>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{t('battles.liveGlobally')}</span>
              </div>
            </div>
          </div>
          
          <DuelList />
        </section>

        <section>
          <DuelHistory />
        </section>
      </div>

      {/* Duel Challenge Modal */}
      <DuelChallengeModal 
        isOpen={isChallengeModalOpen} 
        onClose={() => setIsChallengeModalOpen(false)} 
      />
    </div>
  );
}
