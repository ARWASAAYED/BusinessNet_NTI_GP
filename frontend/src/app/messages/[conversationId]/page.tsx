"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import ChatWindow from "@/components/messaging/ChatWindow";
import Spinner from "@/components/common/Spinner";
import userService, { User } from "@/services/userService";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { t } = useLanguage();

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { conversations, isLoading } = useMessages();
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
      <div className="h-full flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Handle temp conversation IDs (format: temp-userId)
  if (!conversation && conversationId.startsWith("temp-")) {
    const recipientUserId = conversationId.replace("temp-", "");
    return (
      <div className="h-full flex-1 flex flex-col bg-white dark:bg-gray-950 min-h-0 overflow-hidden">
        <ChatWindow
          conversationId={conversationId}
          recipientId={recipientUserId}
          recipientName="User"
          isOnline={false}
          onBack={() => router.push("/messages")}
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
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-950 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('messages.notFound')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('messages.notFoundDesc')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/messages")}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-semibold shadow-md shadow-primary-500/20 transition-all"
          >
            {t('messages.backToMessages')}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex flex-col bg-white dark:bg-gray-950 min-h-0 overflow-hidden">
      <ChatWindow
        conversationId={conversationId}
        recipientId={recipient?._id}
        recipientName={recipient?.username || "Unknown"}
        recipientAvatar={recipient?.avatar}
        recipientAccountType={(recipient as any)?.accountType}
        isOnline={recipient?.isOnline}
        onBack={() => router.push("/messages")}
      />
    </div>
  );
}
