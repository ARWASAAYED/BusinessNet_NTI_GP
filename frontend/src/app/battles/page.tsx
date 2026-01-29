"use client";

import React from 'react';
import DuelList from '@/components/duel/DuelList';
import Card from '@/components/common/Card';
import { Swords, Trophy, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BattlesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="relative mb-12 p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 shadow-2xl shadow-primary-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
           <Swords className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-md">
              <Swords className="w-12 h-12 text-white" />
           </div>
           
           <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Industry Battles</h1>
              <p className="text-primary-50 font-medium max-w-lg">
                The arena where professional ideologies clash. Vote for your favorite industry leaders and support the sharpest arguments in tech and business.
              </p>
           </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/10">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Active Challenges: 12</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
              <Users className="w-4 h-4 text-blue-300" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Live Voters: 1.2k</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
              <Trophy className="w-4 h-4 text-green-300" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Weekly Prize: $500 Credit</span>
           </div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Main Event</h2>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Live Globally</span>
            </div>
          </div>
          
          <DuelList />
        </section>

        {/* Placeholder for past battles or ranking if needed */}
        <Card className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale">
            <div className="text-center">
               <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
               <h3 className="text-sm font-bold uppercase tracking-widest italic tracking-[0.2em]">Hall of Fame Coming Soon</h3>
            </div>
        </Card>
      </div>
    </div>
  );
}
