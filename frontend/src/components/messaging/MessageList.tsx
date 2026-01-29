"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import { Message } from '@/services/messageService';
import { useAuth } from '@/hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString('en-US', {
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
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-4">
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400 font-medium">
              {date}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {msgs.map((message, index) => {
              const userId = user?._id;
              const isOwnMessage = userId === message.senderId._id;
              const showAvatar = !isOwnMessage;

              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {showAvatar && (
                    <Avatar
                      src={message.senderId.avatar}
                      alt={message.senderId.username}
                      size="sm"
                    />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] ${
                      isOwnMessage ? 'items-end' : 'items-start'
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                        {message.senderId.username}
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    
                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-3 ${
                        isOwnMessage ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                      {isOwnMessage && message.isRead && (
                        <span className="ml-1 text-primary-500" title="Read">✓✓</span>
                      )}
                      {isOwnMessage && !message.isRead && (
                        <span className="ml-1 text-gray-400" title="Sent">✓</span>
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
