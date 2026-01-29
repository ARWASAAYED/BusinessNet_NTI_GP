"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineStatus from './OnlineStatus';
import { useMessages } from '@/hooks/useMessages'; // Added useMessages import
import { useAuth } from '@/hooks/useAuth';

interface ChatWindowProps {
  conversationId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  isOnline?: boolean;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  recipientId,
  recipientName,
  recipientAvatar,
  isOnline = false,
  onBack,
}) => {
  const { user } = useAuth(); // Keep useAuth if user is used elsewhere or for context in useMessages
  const { messages, sendMessage, markAsRead, isMessagesLoading, error, refreshMessages } = useMessages(recipientId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    markAsRead(recipientId);
  }, [recipientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-1000">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 dark:text-gray-400" />
            </button>
          )}

          <Avatar src={recipientAvatar} alt={recipientName} size="md" />

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{recipientName}</h2>
            <OnlineStatus isOnline={isOnline} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {error ? (
        <div className="flex-1 flex items-center justify-center dark:bg-gray-950">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => refreshMessages(recipientId)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isLoading={isMessagesLoading} />
      )}

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
