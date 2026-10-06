"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit } from 'lucide-react';
import Input from '@/components/common/Input';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import Spinner from '@/components/common/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useRouter } from 'next/navigation';
import NewChatModal from '@/components/messaging/NewChatModal';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  
  const { conversations = [], isLoading, refreshConversations } = useMessages();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c._id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const getRecipient = (conversation: any) => {
    return conversation.participants.find((p: any) => p._id !== user?._id) || conversation.participants[0];
  };

  useEffect(() => {
    if (conversations.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 1024 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  const handleSelectNewConversation = async (conversationId: string) => {
    await refreshConversations();
    setSelectedConversationId(conversationId);
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const recipient = getRecipient(conversation);
      return recipient?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, user]);

  if (authLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const currentRecipient = selectedConversation ? getRecipient(selectedConversation) : null;

  return (
    <div className="flex-1 flex overflow-hidden h-full min-h-0 bg-white dark:bg-gray-950">
      {/* Conversations Sidebar */}
      <aside
        className={`w-full lg:w-96 border-e border-gray-200/80 dark:border-gray-800/80 flex flex-col shrink-0 transition-all bg-white dark:bg-gray-950 ${
          selectedConversationId ? 'hidden lg:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('messages.title')}</h1>
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              title={t('messages.newConversation')}
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder={t('messages.searchConversations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="md" />
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={selectedConversationId || undefined}
              onSelectConversation={setSelectedConversationId}
            />
          )}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`flex-1 flex flex-col min-w-0 min-h-0 ${!selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConversation && currentRecipient ? (
          <ChatWindow
            conversationId={selectedConversation._id}
            recipientId={currentRecipient._id}
            recipientName={currentRecipient.username || 'User'}
            recipientAvatar={currentRecipient.avatar}
            recipientAccountType={currentRecipient.accountType}
            isOnline={currentRecipient.isOnline}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50/50 dark:bg-gray-950 text-center p-6">
            <div className="max-w-sm">
              <div className="w-16 h-16 rounded-3xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/50 dark:border-primary-800/50 text-primary-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('messages.selectConversation')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('messages.selectConversationDesc')}
              </p>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isNewChatModalOpen && (
          <NewChatModal
            isOpen={isNewChatModalOpen}
            onClose={() => setIsNewChatModalOpen(false)}
            onSelectConversation={handleSelectNewConversation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}