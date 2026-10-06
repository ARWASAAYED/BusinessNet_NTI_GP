"use client";

import React, { useEffect, useState } from 'react';
import { Swords, Clock, Zap } from 'lucide-react';
import duelService, { Duel } from '@/services/duelService';
import DuelCard from './DuelCard';
import Spinner from '../common/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface DuelListProps {
  limit?: number;
  showTabs?: boolean;
}

export default function DuelList({ limit, showTabs = true }: DuelListProps = {}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeDuels, setActiveDuels] = useState<Duel[]>([]);
  const [pendingDuels, setPendingDuels] = useState<Duel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'pending'>('live');

  const currentUserId = user?._id || (user as any)?.id || '';

  const refreshDuels = async () => {
    try {
      const [active, pending] = await Promise.all([
        duelService.listDuels(undefined, 'active'),
        currentUserId ? duelService.listDuels(undefined, 'pending') : Promise.resolve([])
      ]);

      // Show mock duels only if there are NO active duels at all
      if (active.length === 0 && pending.length === 0) {
        setActiveDuels([
          {
            _id: 'mock-1',
            topic: 'Minimalist UI vs Data-Heavy Dashboards',
            description: 'Which approach drives better engagement in 2026?',
            category: 'Design',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            createdAt: new Date().toISOString(),
            challenger: { _id: 'u1', username: 'alex_design', fullName: 'Alex Rivera', avatarUrl: '' },
            challenged: { _id: 'u2', username: 'sarah_data', fullName: 'Sarah Chen', avatarUrl: '' },
            challengerSubmission: { content: 'Users crave breathing room. Simplicity always wins.', media: [], votes: Array(42).fill('v') },
            challengedSubmission: { content: 'Professionals need data density. Context is king.', media: [], votes: Array(38).fill('v') }
          }
        ]);
      } else {
        setActiveDuels(active);
      }

      // Filter pending duels to only those involving the current user
      const myPending = pending.filter(d => {
        const challengerId = typeof d.challenger === 'string' ? d.challenger : d.challenger._id;
        const challengedId = typeof d.challenged === 'string' ? d.challenged : d.challenged._id;
        return challengerId?.toString() === currentUserId || challengedId?.toString() === currentUserId;
      });
      setPendingDuels(myPending);

      // Auto-switch to pending tab if user has pending challenges waiting
      const hasPendingAsChallengee = myPending.some(d => {
        const challengedId = typeof d.challenged === 'string' ? d.challenged : d.challenged._id;
        return challengedId?.toString() === currentUserId;
      });
      if (hasPendingAsChallengee) setActiveTab('pending');
    } catch (error) {
      console.error('Failed to fetch duels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDuels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
        <Spinner size="sm" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Retrieving Battles...</span>
      </div>
    );
  }

  const allDuels = activeTab === 'live' ? activeDuels : pendingDuels;
  const displayedDuels = typeof limit === 'number' ? allDuels.slice(0, limit) : allDuels;

  const handleAccepted = () => {
    setActiveTab('live');
    refreshDuels();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {showTabs && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'live'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t('battles.liveBattles') || 'Live Battles'}
            {activeDuels.length > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{activeDuels.length}</span>
            )}
          </button>

          {pendingDuels.length > 0 && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {t('battles.pendingChallenges') || 'Pending Challenges'}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'pending' ? 'bg-white/20' : 'bg-amber-500 text-white'
              }`}>{pendingDuels.length}</span>
            </button>
          )}
        </div>
      )}

      {displayedDuels.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Swords className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {activeTab === 'pending' ? (t('battles.noPendingChallenges') || 'No pending challenges') : (t('battles.noActiveBattles') || 'No active battles')}
          </p>
        </div>
      ) : (
        displayedDuels.map(duel => (
          <DuelCard key={duel._id} duel={duel} onVote={refreshDuels} onAccepted={handleAccepted} />
        ))
      )}
    </div>
  );
}
