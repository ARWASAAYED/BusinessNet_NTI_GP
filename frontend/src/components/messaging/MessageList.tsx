"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import { Message } from '@/services/messageService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return t('messages.today');
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return t('messages.yesterday');
    } else {
      return messageDate.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center bg-slate-50/40 dark:bg-gray-950">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />
          <span>{t('messages.loading')}</span>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-6 bg-slate-50/40 dark:bg-gray-950">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-500 flex items-center justify-center mx-auto mb-3 border border-primary-200/50 dark:border-primary-800/50 shadow-sm">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            {t('messages.noMessages')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('messages.startConversation')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-gray-950">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex items-center justify-center my-3">
            <div className="px-3.5 py-1 bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 rounded-full text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400 shadow-xs backdrop-blur-sm">
              {date}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {msgs.map((message, index) => {
              const currentUserId = user?.id || user?._id;
              const isOwnMessage = currentUserId === (message.senderId?._id || message.senderId);
              const showAvatar = !isOwnMessage;

              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.2) }}
                  className={`flex gap-2.5 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {showAvatar && (
                    <Avatar
                      src={message.senderId?.avatar}
                      alt={message.senderId?.username || 'User'}
                      size="sm"
                      className="mt-1 shrink-0"
                    />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] sm:max-w-[65%] ${
                      isOwnMessage ? 'items-end' : 'items-start'
                    } flex flex-col`}
                  >
                    {!isOwnMessage && message.senderId?.username && (
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 px-1">
                        {message.senderId.username}
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isOwnMessage
                          ? 'bg-primary-600 text-white rounded-te-xs shadow-sm font-normal'
                          : 'bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-ts-xs shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    
                    <div
                      className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1 flex items-center gap-1 ${
                        isOwnMessage ? 'text-end justify-end' : 'text-start'
                      }`}
                    >
                      <span>{formatTime(message.createdAt)}</span>
                      {isOwnMessage && message.isRead && (
                        <span className="text-primary-500 dark:text-primary-400 font-bold" title={t('messages.read')}>✓✓</span>
                      )}
                      {isOwnMessage && !message.isRead && (
                        <span className="text-gray-400" title={t('messages.sent')}>✓</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
