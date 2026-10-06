"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, Trash2, Ban, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Avatar from '../common/Avatar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineStatus from './OnlineStatus';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/app/providers';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface ChatWindowProps {
  conversationId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientAccountType?: string;
  isOnline?: boolean;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  recipientId,
  recipientName,
  recipientAvatar,
  recipientAccountType,
  isOnline = false,
  onBack,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, isRTL } = useLanguage();
  const { messages, sendMessage, markAsRead, isMessagesLoading, error, refreshMessages, getAiSuggestion } = useMessages(recipientId);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recipientId) {
      markAsRead(recipientId);
    }
  }, [recipientId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    showToast(`${type === 'voice' ? 'Voice' : 'Video'} call feature with ${recipientName} initiated`, 'info');
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Unified Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2 -ms-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 ${
                isRTL ? 'rotate-180' : ''
              }`}
              aria-label="Back to conversations"
              title={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            <Avatar src={recipientAvatar} alt={recipientName} size="md" />
            <div className={`absolute bottom-0 end-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight truncate">
                {recipientName}
              </h2>
              {recipientAccountType && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/60 shrink-0">
                  {recipientAccountType === 'business' ? `🏢 ${t('profile.businessAccount')}` : `👤 ${t('profile.personalAccount')}`}
                </span>
              )}
            </div>
            <div className="mt-0.5">
              <OnlineStatus isOnline={isOnline} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => handleCall('voice')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            title="Start voice call"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleCall('video')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            title="Start video call"
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
              title="More options"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (recipientId) router.push(`/profile/${recipientId}`);
                    }}
                    className="w-full text-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    {t('messages.viewProfile')}
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      showToast(`Blocked ${recipientName}`, 'info');
                    }}
                    className="w-full text-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-2.5"
                  >
                    <Ban className="w-4 h-4 text-gray-400" />
                    {t('messages.blockUser')}
                  </button>
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      showToast('Chat history cleared', 'info');
                    }}
                    className="w-full text-start px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2.5"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    {t('messages.deleteChat')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error ? (
        <div className="flex-1 min-h-0 flex items-center justify-center p-6 bg-slate-50/50 dark:bg-gray-950">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => refreshMessages(recipientId)}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isLoading={isMessagesLoading} />
      )}

      {/* Input */}
      <MessageInput 
        onSend={handleSendMessage} 
        onAiSuggest={(prompt, tone) => getAiSuggestion(prompt || "", tone)} 
      />
    </div>
  );
};

export default ChatWindow;
