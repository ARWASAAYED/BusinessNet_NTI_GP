"use client";

import React, { useState } from 'react';
import { Swords, X, Target, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import duelService from '@/services/duelService';
import { User } from '@/services/userService';
import { useToast } from '@/app/providers';

interface DuelChallengeModalProps {
  opponent: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function DuelChallengeModal({ opponent, isOpen, onClose }: DuelChallengeModalProps) {
  const { showToast } = useToast();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Technology', 'Business', 'Finance', 'Design', 'Marketing'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !category || !content) return;

    setIsSubmitting(true);
    try {
      await duelService.createDuel({
        topic,
        description,
        content,
        challengedId: opponent._id,
        category
      });
      showToast(`Challenge sent to ${opponent.username}! Waiting for acceptance.`, 'success');
      onClose();
    } catch (error) {
      console.error('Failed to create duel:', error);
      showToast('Failed to send challenge. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg z-10"
          >
            <Card className="overflow-hidden border-2 border-primary-500 shadow-2xl">
              <div className="bg-primary-500 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Swords className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter">Issue a Challenge</h2>
                    <p className="text-xs text-primary-100 font-medium">Battle {opponent.fullName} for professional glory</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800 flex gap-4">
                   <Target className="w-6 h-6 text-primary-600 shrink-0 mt-1" />
                   <div className="space-y-1">
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest">Target Industry</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                              category === cat 
                                ? 'bg-primary-500 text-white shadow-lg' 
                                : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary-500'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Battle Topic</label>
                   <Input 
                     placeholder="e.g. Clean Code vs Speed to Market" 
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                     required
                     className="py-4"
                   />
                </div>

                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-primary-500">Your Opening Argument (Opening Fire)</label>
                   <textarea 
                     rows={4}
                     placeholder="State your professional stance. This will be the first thing the community reads."
                     className="w-full px-4 py-3 rounded-xl border-2 border-primary-100 dark:border-primary-900 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 text-sm font-bold"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     required
                   />
                </div>

                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Context / Motivation</label>
                   <textarea 
                     rows={3}
                     placeholder="What are the stakes? Why this challenge?"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 text-sm font-medium"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                   />
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                   <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                     Once sent, {opponent.username} must accept to start the 24-hour voting period. Winners gain a massive Reputation impact.
                   </p>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  className="w-full py-4 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
                >
                  📡 Transmit Challenge
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
