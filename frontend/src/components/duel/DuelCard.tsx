"use client";

import React, { useState } from 'react';
import { Swords, Trophy, Vote, Users, Clock, Zap, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Duel } from '@/services/duelService';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatTimeAgo } from '@/utils/dateHelpers';
import duelService from '@/services/duelService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/app/providers';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface DuelCardProps {
  duel: Duel;
  onVote?: () => void;
  onAccepted?: () => void;
}

export default function DuelCard({ duel, onVote, onAccepted }: DuelCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [activeDuel, setActiveDuel] = useState(duel);
  const [isVoting, setIsVoting] = useState(false);

  const challengerVotes = activeDuel.challengerSubmission?.votes?.length || 0;
  const challengedVotes = activeDuel.challengedSubmission?.votes?.length || 0;
  const totalVotes = challengerVotes + challengedVotes;

  const challengerPercent = totalVotes === 0 ? 50 : Math.round((challengerVotes / totalVotes) * 100);
  const challengedPercent = totalVotes === 0 ? 50 : 100 - challengerPercent;

  const currentUserId = user?._id || (user as any)?.id || '';
  const hasVoted = Boolean(
    currentUserId && (
      activeDuel.challengerSubmission?.votes?.some((v: any) => {
        const id = typeof v === 'string' ? v : v?._id || v?.id || v;
        return id?.toString() === currentUserId.toString();
      }) ||
      activeDuel.challengedSubmission?.votes?.some((v: any) => {
        const id = typeof v === 'string' ? v : v?._id || v?.id || v;
        return id?.toString() === currentUserId.toString();
      })
    )
  );

  const [submissionText, setSubmissionText] = useState('');
  const [submissionMedia, setSubmissionMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);

  const getActor = (actor: any) => {
    return typeof actor === 'string' ? { _id: actor, username: 'User', fullName: 'User', avatarUrl: '' } : actor;
  };

  const challenger = getActor(activeDuel.challenger);
  const challenged = getActor(activeDuel.challenged);

  // Robust ID comparison - normalize both sides to strings
  const normalizeId = (id: any): string => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    return id._id?.toString() || id.id?.toString() || id.toString();
  };

  const isChallenger = normalizeId(activeDuel.challenger) === normalizeId(currentUserId)
    || normalizeId(challenger._id) === normalizeId(currentUserId);
  const isChallenged = normalizeId(activeDuel.challenged) === normalizeId(currentUserId)
    || normalizeId(challenged._id) === normalizeId(currentUserId);

  const handleVote = async (side: 'challenger' | 'challenged') => {
    if (!user) {
      showToast(t('battles.signInToVote'), 'info');
      return;
    }
    if (hasVoted || isVoting) return;
    
    // Handle Mock Duels locally for entertainment
    if (activeDuel._id.startsWith('mock-')) {
      const updated = { ...activeDuel };
      if (side === 'challenger') {
        updated.challengerSubmission = {
          ...updated.challengerSubmission!,
          votes: [...(updated.challengerSubmission?.votes || []), currentUserId]
        };
      } else {
        updated.challengedSubmission = {
          ...updated.challengedSubmission!,
          votes: [...(updated.challengedSubmission?.votes || []), currentUserId]
        };
      }
      setActiveDuel(updated);
      showToast('Vote recorded for skill battle!', 'success');
      onVote?.();
      return;
    }

    setIsVoting(true);
    try {
      const updated = await duelService.vote(activeDuel._id, side);
      setActiveDuel(updated);
      showToast('Vote recorded for battle!', 'success');
      onVote?.();
    } catch (error: any) {
      console.error('Voting failed:', error);
      showToast(error.response?.data?.message || 'Voting failed', 'error');
    } finally {
      setIsVoting(false);
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSubmissionMedia(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    setSubmissionMedia(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAccept = async () => {
    if (!user || !submissionText || isAccepting) return;
    setIsAccepting(true);
    try {
      const updated = await duelService.acceptDuel(activeDuel._id, { 
        content: submissionText,
        media: submissionMedia
      });
      setActiveDuel(updated);
      showToast('Battle is LIVE! Good luck.', 'success');
      // Use callback if provided, otherwise reload as fallback
      if (onAccepted) {
        onAccepted();
      } else if (onVote) {
        onVote();
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
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
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('battles.industryDuel')}: {activeDuel.category}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
           <Clock className="w-3 h-3" />
           <span>
             {new Date(activeDuel.expiresAt) < new Date() && activeDuel.status === 'active' 
               ? t('battles.expired')
               : `${t('battles.ends')} ${new Date(activeDuel.expiresAt).toLocaleDateString()}`
             }
           </span>
           {new Date(activeDuel.expiresAt) < new Date() && activeDuel.status === 'active' && (
             <button 
               onClick={async () => {
                 try {
                   const updated = await duelService.finalize(activeDuel._id);
                   setActiveDuel(updated);
                   showToast('Battle finalized!', 'success');
                 } catch (e) {
                   showToast('Finalization failed', 'error');
                 }
               }}
               className="ms-2 bg-white text-primary-600 px-2 py-0.5 rounded uppercase font-black hover:bg-primary-50 transition-colors"
             >
               {t('battles.finalize')}
             </button>
           )}
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
                <Avatar src={challenger.avatarUrl} alt={challenger.fullName} size="xl" className="border-4 border-white dark:border-gray-900 ring-4 ring-primary-500/20" />
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                   <Trophy className="w-4 h-4" />
                </div>
             </div>
             <div>
                <h4 className="font-black text-gray-900 dark:text-gray-100">{challenger.fullName}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('battles.theChallenger')}</p>
             </div>
             <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl w-full border border-gray-100 dark:border-gray-800 text-sm font-medium italic leading-relaxed">
                <p className="mb-2">"{activeDuel.challengerSubmission?.content || t('battles.awaitingEntry')}"</p>
                {activeDuel.challengerSubmission?.media && activeDuel.challengerSubmission.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 not-italic">
                    {activeDuel.challengerSubmission.media.map((url, i) => (
                      <img key={i} src={url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${url}`} className="w-16 h-16 object-cover rounded-lg border border-gray-100" alt="evidence" />
                    ))}
                  </div>
                )}
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
                     <span>{hasVoted ? t('battles.voteRecorded') : t('battles.supportSkill')}</span>
                  </div>
               </Button>
             )}
          </div>

          {/* Challenged */}
          <div className="flex flex-col items-center text-center space-y-4">
             <Avatar src={challenged.avatarUrl} alt={challenged.fullName} size="xl" className="border-4 border-white dark:border-gray-900 ring-4 ring-secondary-500/20" />
             <div>
                <h4 className="font-black text-gray-900 dark:text-gray-100">{challenged.fullName}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('battles.theContender')}</p>
             </div>
             <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl w-full border border-gray-100 dark:border-gray-800 text-sm font-medium italic leading-relaxed">
                {activeDuel.status === 'active' ? (
                  <>
                   <p className="mb-2">"{activeDuel.challengedSubmission?.content}"</p>
                   {activeDuel.challengedSubmission?.media && activeDuel.challengedSubmission.media.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2 not-italic">
                       {activeDuel.challengedSubmission.media.map((url, i) => (
                          <img key={i} src={url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${url}`} className="w-16 h-16 object-cover rounded-lg border border-gray-100" alt="evidence" />
                       ))}
                     </div>
                   )}
                  </>
                ) : (
                   activeDuel.status === 'pending' ? (
                      isChallenged ? (
                        <div className="space-y-4 not-italic">
                           <textarea 
                             className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-xl text-xs p-3 focus:ring-1 focus:ring-primary-500" 
                             placeholder={t('battles.enterArgument')}
                             value={submissionText}
                             onChange={(e) => setSubmissionText(e.target.value)}
                           />
                           
                           <div className="flex flex-wrap gap-2">
                             {previews.map((u, i) => (
                               <div key={i} className="relative w-12 h-12">
                                 <img src={u} className="w-full h-full object-cover rounded-lg" alt="preview" />
                                 <button onClick={() => removeMedia(i)} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full"><X className="w-2 h-2" /></button>
                               </div>
                             ))}
                             {previews.length < 5 && (
                               <label className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-500">
                                 <ImageIcon className="w-4 h-4 text-gray-300" />
                                 <input type="file" className="hidden" multiple accept="image/*" onChange={handleMediaSelect} />
                               </label>
                             )}
                           </div>

                           <Button 
                             size="sm" 
                             className="w-full bg-success-600 hover:bg-success-700 font-black uppercase tracking-widest text-[10px]"
                             onClick={handleAccept}
                             isLoading={isAccepting}
                             disabled={!submissionText.trim()}
                           >
                             {t('battles.finalizeAndFight')}
                           </Button>
                        </div>
                      ) : t('battles.preparingDefense')
                   ) : (
                     activeDuel.status === 'completed' ? (
                       <>
                         <p className="mb-2">"{activeDuel.challengedSubmission?.content}"</p>
                       </>
                     ) : t('battles.awaitingResponse')
                   )
                )}
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
                     <span>{hasVoted ? t('battles.voteRecorded') : t('battles.backContender')}</span>
                  </div>
               </Button>
             )}
             {activeDuel.status === 'pending' && isChallenger && (
                <div className="flex items-center gap-2 text-primary-500 font-bold text-xs animate-pulse bg-primary-500/10 px-4 py-2 rounded-full justify-center">
                   <Clock className="w-3 h-3" />
                   <span>{t('battles.waitingResponse')}</span>
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
           <p className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">{t('battles.audienceVerdict')}</p>
        </div>
      </div>
    </Card>
  );
}
