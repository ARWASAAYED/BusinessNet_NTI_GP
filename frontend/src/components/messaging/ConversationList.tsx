"use client";

import React from "react";
import { motion } from "framer-motion";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import { Conversation } from "@/services/messageService";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => {
  const { user } = useAuth();
  const { t, locale, isRTL } = useLanguage();

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
    );

    const loc = locale === 'ar' ? 'ar-EG' : 'en-US';

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString(loc, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString(loc, { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString(loc, {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-sm font-semibold mb-1">{t('messages.noConversations')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('messages.startMessaging')}
          </p>
        </div>
      </div>
    );
  }

  const currentUserId = user?.id || user?._id;

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
      {conversations.map((conversation, index) => {
        const otherParticipant =
          conversation.participants.find(
            (p: any) => (p._id || p.id) !== currentUserId
          ) || conversation.participants[0];

        const isActive = conversation._id === activeConversationId;

        return (
          <motion.div
            key={conversation._id}
            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.2) }}
          >
            <button
              onClick={() => onSelectConversation(conversation._id)}
              className={`w-full p-4 flex items-start gap-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors text-start relative ${
                isActive
                  ? "bg-primary-50/60 dark:bg-primary-950/30"
                  : ""
              }`}
            >
              {isActive && (
                <div className="absolute start-0 top-2 bottom-2 w-1 bg-primary-500 rounded-e-full" />
              )}

              {/* Avatar with Online Status */}
              <div className="relative shrink-0">
                <Avatar
                  src={otherParticipant?.avatar}
                  alt={otherParticipant?.username || "User"}
                  size="md"
                />
                {otherParticipant?.isOnline && (
                  <div className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-bold text-sm truncate ${
                      conversation.unreadCount > 0
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {otherParticipant?.username || "Unknown"}
                  </h3>
                  {conversation.updatedAt && (
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 ms-2 shrink-0">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  )}
                </div>

                {conversation.lastMessage ? (
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        conversation.unreadCount > 0
                          ? "text-gray-900 dark:text-gray-100 font-semibold"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="shrink-0 text-[10px] px-1.5 py-0.5"
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">{t('messages.noMessages')}</p>
                )}
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ConversationList;
