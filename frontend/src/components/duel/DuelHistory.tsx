"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Users, Star } from 'lucide-react';
import duelService, { Duel } from '@/services/duelService';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

export default function DuelHistory() {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await duelService.listDuels(undefined, 'completed');
        setDuels(data);
      } catch (error) {
        console.error('Failed to fetch duel history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (duels.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20">
            <Trophy className="w-5 h-5" />
         </div>
         <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Hall of Fame</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duels.map(duel => {
          const totalVotes = (duel.challengerSubmission?.votes?.length || 0) + (duel.challengedSubmission?.votes?.length || 0);
          
          // Type safe references
          const challengerId = typeof duel.challenger === 'string' ? duel.challenger : duel.challenger?._id;
          const winnerObj = typeof duel.winner === 'object' ? duel.winner : null;
          const winnerId = typeof duel.winner === 'string' ? duel.winner : duel.winner?._id;

          return (
            <Card key={duel._id} className="p-5 border-none shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative overflow-hidden group">
              {/* Winner Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
              
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                    {duel.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-400">
                    <Users className="w-3 h-3" />
                    {totalVotes} VOTES
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">
                  {duel.topic}
                </h3>

                <div className="mt-auto flex items-center gap-4">
                  <div className="relative">
                    <Avatar 
                      src={winnerObj?.avatarUrl} 
                      alt={winnerObj?.username || 'Winner'} 
                      size="sm" 
                      className="border-2 border-amber-500 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-md">
                      <Trophy className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Victor</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">@{winnerObj?.username || 'Anonymous'}</p>
                  </div>
                  
                  <div className="ml-auto flex flex-col items-end">
                     <div className="flex items-center gap-1 text-primary-600 font-black text-sm">
                        <Star className="w-3 h-3 fill-current" />
                        <span>+{Math.floor(totalVotes / 2)} REP</span>
                     </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
