"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import { Conversation } from "@/services/messageService";

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
  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No conversations yet</p>
          <p className="text-sm">
            Start messaging to see your conversations here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {conversations.map((conversation, index) => {
        const otherParticipant = conversation.participants[0];
        const isActive = conversation._id === activeConversationId;

        return (
          <motion.div
            key={conversation._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => onSelectConversation(conversation._id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                isActive ? "bg-primary-50 dark:bg-primary-900/20" : ""
              }`}
            >
              {/* Avatar with Online Status */}
              <div className="relative flex-shrink-0">
                <Avatar
                  src={otherParticipant.avatar}
                  alt={otherParticipant.username}
                  size="md"
                />
                {otherParticipant.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      conversation.unreadCount > 0
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {otherParticipant.username}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  )}
                </div>

                {conversation.lastMessage && (
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="ml-2 flex-shrink-0"
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
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
