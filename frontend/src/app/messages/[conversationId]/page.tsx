"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Trash2,
  Ban,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import ChatWindow from "@/components/messaging/ChatWindow";
import Spinner from "@/components/common/Spinner";
import Avatar from "@/components/common/Avatar";
import userService, { User } from "@/services/userService";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { conversations, isLoading } = useMessages();
  const [showMenu, setShowMenu] = useState(false);
  const [fetchedRecipient, setFetchedRecipient] = useState<User | null>(null);
  const [isFetchingRecipient, setIsFetchingRecipient] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const conversation = conversations.find((c) => c._id === conversationId);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (
        !conversation &&
        conversationId &&
        !conversationId.startsWith("temp-") &&
        isAuthenticated
      ) {
        try {
          setIsFetchingRecipient(true);
          const data = await userService.getProfile(conversationId);
          setFetchedRecipient(data);
        } catch (error) {
          console.error("Failed to fetch recipient:", error);
        } finally {
          setIsFetchingRecipient(false);
        }
      }
    };

    fetchRecipient();
  }, [conversation, conversationId, isAuthenticated]);

  if (authLoading || isLoading || isFetchingRecipient) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Handle temp conversation IDs (format: temp-userId)
  if (!conversation && conversationId.startsWith("temp-")) {
    const recipientUserId = conversationId.replace("temp-", "");
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/messages")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Go back to messages"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">
                New Conversation
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start messaging
              </p>
            </div>
          </div>
        </div>

        <ChatWindow
          conversationId={conversationId}
          recipientId={recipientUserId}
          recipientName="User"
          isOnline={false}
        />
      </div>
    );
  }

  // Determine recipient
  let recipient = null;
  if (conversation) {
    recipient =
      conversation.participants.find((p: any) => p._id !== user?._id) ||
      conversation.participants[0];
  } else if (fetchedRecipient) {
    recipient = fetchedRecipient;
  }

  if (!recipient) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Conversation not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The conversation you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/messages")}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Messages
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/messages")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back to messages"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <Avatar src={recipient?.avatar} alt={recipient?.username} size="md" />

          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              {recipient?.username || "Unknown User"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(recipient as any)?.accountType === "business"
                ? "🏢 Business"
                : "👤 Individual"}
            </p>
          </div>
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Block User
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Chat
              </button>
            </motion.div>
          )}
        </div>
      </div>


      {/* Chat Content */}
      <ChatWindow
        conversationId={conversationId}
        recipientId={recipient?._id}
        recipientName={recipient?.username || "Unknown"}
        recipientAvatar={recipient?.avatar}
        isOnline={recipient?.isOnline}
      />
    </div>
  );
}
