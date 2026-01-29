"use client";

import React, { useEffect, useState } from 'react';
import { Swords } from 'lucide-react';
import duelService, { Duel } from '@/services/duelService';
import DuelCard from './DuelCard';
import Spinner from '../common/Spinner';

export default function DuelList() {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDuels = async () => {
      try {
        const data = await duelService.listDuels();
        if (data.length === 0) {
          // Add some "Featured Battles" for entertainment
          const mockDuels: Duel[] = [
            {
              _id: 'mock-1',
              topic: 'Minimalist UI vs Data-Heavy Dashboards',
              description: 'Which approach drives better engagement in 2026?',
              category: 'Design',
              status: 'active',
              expiresAt: new Date(Date.now() + 86400000).toISOString(),
              createdAt: new Date().toISOString(),
              challenger: {
                _id: 'u1',
                username: 'alex_design',
                fullName: 'Alex Rivera',
                avatarUrl: ''
              },
              challenged: {
                _id: 'u2',
                username: 'sarah_data',
                fullName: 'Sarah Chen',
                avatarUrl: ''
              },
              challengerSubmission: {
                content: 'Users crave breathing room. Simplicity always wins.',
                media: [],
                votes: Array(42).fill('v')
              },
              challengedSubmission: {
                content: 'Professionals need data density. Context is king.',
                media: [],
                votes: Array(38).fill('v')
              }
            }
          ];
          setDuels(mockDuels);
        } else {
          setDuels(data);
        }
      } catch (error) {
        console.error('Failed to fetch duels:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDuels();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
        <Spinner size="sm" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Retrieving Active Duels...</span>
      </div>
    );
  }

  if (duels.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-primary-500 rounded-lg text-white shadow-lg shadow-primary-500/20">
            <Swords className="w-5 h-5" />
         </div>
         <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight underline decoration-primary-500/30 underline-offset-8">Live Battles</h2>
      </div>
      {duels.map(duel => (
        <DuelCard key={duel._id} duel={duel} />
      ))}
    </div>
  );
}
