"use client";

import React, { useState } from "react";
import { MessageSquare, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import messageService from "@/services/messageService";

interface MessageButtonProps {
  userId: string;
  userName?: string;
  variant?: "icon" | "button" | "minimal";
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  userId,
  userName = "User",
  variant = "button",
  className = "",
  size = "md",
  showLabel = true,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!userId) {
      console.warn("No userId provided to MessageButton");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting conversation with userId:", userId);

      const conversation = await messageService.startConversation(userId);
      console.log("Conversation created/found:", conversation);

      // Navigate to messages page with the conversation selected
      // Use temp ID if it's a new conversation
      const navigationPath = `/messages?conversationId=${conversation._id}`;
      console.log("Navigating to:", navigationPath);
      router.push(navigationPath);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Fallback: navigate to messages page
      console.log("Fallback: navigating to /messages");
      router.push("/messages");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartConversation}
        disabled={isLoading}
        className={`${sizeClasses[size]} hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={`Message ${userName}`}
        title={`Message ${userName}`}
      >
        {isLoading ? (
          <Loader className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <MessageSquare className={iconSizes[size]} />
        )}
      </motion.button>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartConversation}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}
        {showLabel && "Message"}
      </motion.button>
    );
  }

  // Default button variant
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleStartConversation}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <MessageSquare className="w-5 h-5" />
      )}
      {showLabel && `Message`}
    </motion.button>
  );
};

export default MessageButton;
