"use client";

import React, { useState, useEffect } from 'react';
import { Swords, X, Target, Info, Plus, Search, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';
import Portal from '../common/Portal';
import duelService from '@/services/duelService';
import userService, { User } from '@/services/userService';
import { useToast } from '@/app/providers';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface DuelChallengeModalProps {
  opponent?: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DuelChallengeModal({ opponent: initialOpponent, isOpen, onClose }: DuelChallengeModalProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [selectedOpponent, setSelectedOpponent] = useState<User | null>(initialOpponent || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const categories = ['Technology', 'Business', 'Finance', 'Design', 'Marketing'];

  useEffect(() => {
    setSelectedOpponent(initialOpponent || null);
  }, [initialOpponent, isOpen]);

  // Live search opponents when no opponent is selected
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2 && !selectedOpponent) {
        setIsSearching(true);
        try {
          const results = await userService.searchUsers(searchQuery.trim());
          setSearchResults(results || []);
        } catch (err) {
          console.error("Opponent search failed:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedOpponent]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setMedia(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpponent) {
      showToast(t('battles.selectOpponentError'), 'error');
      return;
    }
    if (!topic || !category || !content) {
      showToast(t('battles.fillRequired'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await duelService.createDuel({
        topic,
        description,
        content,
        challengedId: selectedOpponent._id,
        category,
        media
      });
      showToast(t('battles.challengeSent', { name: selectedOpponent.username }), 'success');
      onClose();
    } catch (error: any) {
      console.error('Failed to create duel:', error);
      const msg = error?.response?.data?.message || t('battles.challengeFailed');
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg z-10 flex flex-col max-h-[90vh]"
          >
            <div className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-950 rounded-3xl flex flex-col min-h-0 max-h-[90vh]">
              {/* Header - sticky, always visible */}
              <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-6 flex items-center justify-between text-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">{t('battles.challengeTitle')}</h2>
                    <p className="text-xs text-primary-100 font-medium">
                      {selectedOpponent 
                        ? t('battles.battleGlory', { name: selectedOpponent.fullName || selectedOpponent.username })
                        : t('battles.challengeSubtitle')}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable form content */}
              <div className="overflow-y-auto flex-1 min-h-0">
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Opponent Selection */}
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    {t('battles.selectOpponent')}
                  </label>
                  {selectedOpponent ? (
                    <div className="flex items-center justify-between p-3.5 bg-primary-50/60 dark:bg-primary-950/40 rounded-2xl border border-primary-200/80 dark:border-primary-800/80">
                      <div className="flex items-center gap-3">
                        <Avatar src={selectedOpponent.avatar} alt={selectedOpponent.username} size="md" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {selectedOpponent.fullName || selectedOpponent.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{selectedOpponent.username} • {selectedOpponent.accountType || "Professional"}
                          </p>
                        </div>
                      </div>
                      {!initialOpponent && (
                        <button
                          type="button"
                          onClick={() => setSelectedOpponent(null)}
                          className="text-xs font-bold text-primary-600 hover:text-primary-700 p-1"
                        >
                          {t('battles.change')}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={t('battles.searchOpponent')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
                        />
                      </div>
                      {isSearching && (
                        <p className="text-xs text-gray-400 px-2 animate-pulse">{t('battles.searching')}</p>
                      )}
                      {searchResults.length > 0 && (
                        <div className="max-h-44 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 shadow-md">
                          {searchResults.map((user) => (
                            <button
                              key={user._id}
                              type="button"
                              onClick={() => {
                                setSelectedOpponent(user);
                                setSearchResults([]);
                                setSearchQuery('');
                              }}
                              className="w-full p-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
                            >
                              <Avatar src={user.avatar} alt={user.username} size="sm" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                                  {user.fullName || user.username}
                                </p>
                                <p className="text-[10px] text-gray-500 truncate">@{user.username}</p>
                              </div>
                              <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                                {t('battles.select')}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Industry */}
                <div className="p-4 bg-primary-50/50 dark:bg-primary-950/30 rounded-2xl border border-primary-100/80 dark:border-primary-800/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      {t('battles.targetIndustry')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                          category === cat 
                            ? 'bg-primary-500 text-white shadow-sm' 
                            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600'
                        }`}
                      >
                        {t(`categories.${cat}`, cat)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    {t('battles.battleTopic')}
                  </label>
                  <Input 
                    placeholder={t('battles.topicPlaceholder')} 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    className="py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
                  />
                </div>

                {/* Opening Argument */}
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    {t('battles.openingArgument')}
                  </label>
                  <textarea 
                    rows={4}
                    placeholder={t('battles.argumentPlaceholder')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm leading-relaxed resize-none focus:outline-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    {t('battles.visualEvidence')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {previews.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeMedia(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-primary-500 transition-colors group bg-gray-50/50 dark:bg-gray-900/50">
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">{t('battles.addImage')}</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleMediaSelect}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Context */}
                <div>
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    {t('battles.context')}
                  </label>
                  <textarea 
                    rows={2}
                    placeholder={t('battles.contextPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none text-sm resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                  <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('battles.rulesHint')}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  disabled={!selectedOpponent || !topic.trim() || !content.trim()}
                  className="w-full py-3.5 rounded-2xl text-base font-bold shadow-lg shadow-primary-500/20"
                >
                  {t('battles.transmitChallenge')}
                </Button>
              </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return <Portal>{modal}</Portal>;
}
