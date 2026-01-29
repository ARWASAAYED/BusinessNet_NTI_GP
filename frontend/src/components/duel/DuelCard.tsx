"use client";

import React, { useState } from 'react';
import { Swords, Trophy, Vote, Users, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Duel } from '@/services/duelService';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatTimeAgo } from '@/utils/dateHelpers';
import duelService from '@/services/duelService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/app/providers';

interface DuelCardProps {
  duel: Duel;
  onVote?: () => void;
}

export default function DuelCard({ duel, onVote }: DuelCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeDuel, setActiveDuel] = useState(duel);
  const [isVoting, setIsVoting] = useState(false);

  const challengerVotes = activeDuel.challengerSubmission?.votes?.length || 0;
  const challengedVotes = activeDuel.challengedSubmission?.votes?.length || 0;
  const totalVotes = challengerVotes + challengedVotes || 1;

  const challengerPercent = Math.round((challengerVotes / totalVotes) * 100);
  const challengedPercent = 100 - challengerPercent;

  const hasVoted = user && (
    activeDuel.challengerSubmission?.votes?.includes(user._id) || 
    activeDuel.challengedSubmission?.votes?.includes(user._id)
  );

  const [submissionText, setSubmissionText] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);

  const handleVote = async (side: 'challenger' | 'challenged') => {
    if (!user || hasVoted || isVoting) return;
    
    // Handle Mock Duels locally for entertainment
    if (activeDuel._id.startsWith('mock-')) {
      const updated = { ...activeDuel };
      if (side === 'challenger') {
        updated.challengerSubmission = {
          ...updated.challengerSubmission!,
          votes: [...(updated.challengerSubmission?.votes || []), user._id]
        };
      } else {
        updated.challengedSubmission = {
          ...updated.challengedSubmission!,
          votes: [...(updated.challengedSubmission?.votes || []), user._id]
        };
      }
      setActiveDuel(updated);
      onVote?.();
      return;
    }

    setIsVoting(true);
    try {
      const updated = await duelService.vote(activeDuel._id, side);
      setActiveDuel(updated);
      onVote?.();
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAccept = async () => {
    if (!user || !submissionText || isAccepting) return;
    setIsAccepting(true);
    try {
      const updated = await duelService.acceptDuel(activeDuel._id, { content: submissionText });
      setActiveDuel(updated);
      showToast('Battle is LIVE! Good luck.', 'success');
      // Refresh to put it in the "Active" feed properly
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Failed to accept duel:', error);
      showToast('Failed to start battle. Try again.', 'error');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary-500/20 bg-gradient-to-br from-white to-primary-50/10 dark:from-gray-950 dark:to-primary-900/5 relative mb-8">
      {/* Header Accent */}
      <div className="bg-primary-500 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Swords className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Industry Duel: {activeDuel.category}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
           <Clock className="w-3 h-3" />
           <span>Ends {new Date(activeDuel.expiresAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2 text-center">{activeDuel.topic}</h3>
        <p className="text-xs text-gray-500 text-center mb-8 font-medium">"{activeDuel.description}"</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          {/* VS Overlay */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-950 border-4 border-primary-500 flex items-center justify-center z-10 shadow-xl hidden md:flex">
             <span className="font-black text-primary-600 text-sm">VS</span>
          </div>

          {/* Challenger */}
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="relative">
                <Avatar src={activeDuel.challenger.avatarUrl} alt={activeDuel.challenger.fullName} size="xl" className="border-4 border-white dark:border-gray-900 ring-4 ring-primary-500/20" />
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                   <Trophy className="w-4 h-4" />
                </div>
             </div>
             <div>
                <h4 className="font-black text-gray-900 dark:text-gray-100">{activeDuel.challenger.fullName}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">The Challenger</p>
             </div>
             <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl w-full border border-gray-100 dark:border-gray-800 text-sm font-medium italic italic leading-relaxed">
                "{activeDuel.challengerSubmission?.content || 'Awaiting entry...'}"
             </div>
             {activeDuel.status === 'active' && (
               <Button 
                 variant={hasVoted ? 'ghost' : 'primary'} 
                 className="w-full rounded-xl py-3 group"
                 disabled={hasVoted || isVoting}
                 onClick={() => handleVote('challenger')}
               >
                  <div className="flex items-center justify-center gap-2">
                     <Vote className={`w-4 h-4 ${hasVoted ? 'text-success-500' : ''}`} />
                     <span>{hasVoted ? 'Vote Recorded' : 'Support Skill'}</span>
                  </div>
               </Button>
             )}
          </div>

          {/* Challenged */}
          <div className="flex flex-col items-center text-center space-y-4">
             <Avatar src={activeDuel.challenged.avatarUrl} alt={activeDuel.challenged.fullName} size="xl" className="border-4 border-white dark:border-gray-900 ring-4 ring-secondary-500/20" />
             <div>
                <h4 className="font-black text-gray-900 dark:text-gray-100">{activeDuel.challenged.fullName}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">The Contender</p>
             </div>
             <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl w-full border border-gray-100 dark:border-gray-800 text-sm font-medium italic leading-relaxed">
                "{activeDuel.challengedSubmission?.content || (
                   activeDuel.status === 'pending' ? (
                      user?._id === activeDuel.challenged._id ? (
                        <div className="space-y-4 not-italic">
                           <textarea 
                             className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-xl text-xs p-3 focus:ring-1 focus:ring-primary-500" 
                             placeholder="Enter your opening argument to accept..." 
                             value={submissionText}
                             onChange={(e) => setSubmissionText(e.target.value)}
                           />
                           <Button 
                             size="sm" 
                             className="w-full bg-success-600 hover:bg-success-700"
                             onClick={handleAccept}
                             isLoading={isAccepting}
                             disabled={!submissionText.trim()}
                           >
                             Accept & Go Live
                           </Button>
                        </div>
                      ) : "Preparing defense..."
                   ) : "Preparing defense..."
                )}"
             </div>
             {activeDuel.status === 'active' && (
               <Button 
                 variant={hasVoted ? 'ghost' : 'outline'} 
                 className="w-full rounded-xl py-3 border-2"
                 disabled={hasVoted || isVoting}
                 onClick={() => handleVote('challenged')}
               >
                  <div className="flex items-center justify-center gap-2">
                     <Zap className={`w-4 h-4 ${hasVoted ? 'text-success-500' : ''}`} />
                     <span>{hasVoted ? 'Vote Recorded' : 'Back Contender'}</span>
                  </div>
               </Button>
             )}
             {activeDuel.status === 'pending' && user?._id === activeDuel.challenger._id && (
                <div className="flex items-center gap-2 text-primary-500 font-bold text-xs animate-pulse bg-primary-500/10 px-4 py-2 rounded-full justify-center">
                   <Clock className="w-3 h-3" />
                   <span>Waiting for Response</span>
                </div>
             )}
          </div>
        </div>

        {/* Voting Progress Belt */}
        <div className="mt-12 text-center overflow-hidden">
           <div className="flex justify-between items-end mb-2 transition-all">
              <div className="text-left">
                 <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{challengerPercent}%</p>
                 <div className="flex items-center gap-1 text-gray-400"><Users className="w-3 h-3" /> <span className="text-[10px] font-bold">{challengerVotes}</span></div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">{challengedPercent}%</p>
                 <div className="flex items-center gap-1 text-gray-400 justify-end"><Users className="w-3 h-3" /> <span className="text-[10px] font-bold">{challengedVotes}</span></div>
              </div>
           </div>
           <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full flex overflow-hidden">
              <motion.div 
                animate={{ width: `${challengerPercent}%` }}
                className="h-full bg-primary-500"
              />
              <motion.div 
                animate={{ width: `${challengedPercent}%` }}
                className="h-full bg-secondary-500"
              />
           </div>
           <p className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Audience Professional Verdict</p>
        </div>
      </div>
    </Card>
  );
}
