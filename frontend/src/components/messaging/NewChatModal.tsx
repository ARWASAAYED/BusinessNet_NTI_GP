"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import userService, { User } from '@/services/userService';
import messageService from '@/services/messageService';
import Avatar from '../common/Avatar';
import Input from '../common/Input';
import Spinner from '../common/Spinner';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else if (searchQuery.trim().length === 0) {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await userService.searchUsers(searchQuery);
      setUsers(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (recipientId: string) => {
    try {
      const conversation = await messageService.startConversation(recipientId);
      onSelectConversation(conversation._id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to start conversation');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">New Message</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search people by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 text-sm">
                {error}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleStartChat(user._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-left group"
                  >
                    <Avatar src={user.avatar} alt={user.username} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
                      {user.bio && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.bio}</p>}
                    </div>
                    <MessageSquare className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="text-center py-8 text-gray-500">
                No users found for "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                Search for someone to start a conversation
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewChatModal;
