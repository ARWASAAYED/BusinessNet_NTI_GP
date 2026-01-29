import { useState, useEffect, useCallback } from "react";
import communityService, {
  CommunityMessage,
} from "@/services/communityService";
import { useSocket } from "./useSocket";

export const useCommunityMessages = (communityId: string) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { on, off, emit } = useSocket();

  const loadMessages = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const data = await communityService.getMessages(communityId, page);
        if (page === 1) {
          setMessages(data.messages);
        } else {
          setMessages((prev) => [...data.messages, ...prev]);
        }
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to load community messages:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [communityId]
  );

  useEffect(() => {
    if (communityId) {
      loadMessages();
      emit("join_community", communityId);
    }
    return () => {
      if (communityId) {
        emit("leave_community", communityId);
      }
    };
  }, [communityId, loadMessages, emit]);

  useEffect(() => {
    const handleNewMessage = (message: CommunityMessage) => {
      if (message.communityId === communityId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    on("community_message", handleNewMessage);
    return () => off("community_message", handleNewMessage);
  }, [communityId, on, off]);

  useEffect(() => {
    const handleDeletedMessage = (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    on("community_message_deleted", handleDeletedMessage);
    return () => off("community_message_deleted", handleDeletedMessage);
  }, [on, off]);

  const sendMessage = async (
    content: string,
    media?: File[],
    isAnnouncement?: boolean
  ) => {
    try {
      const newMessage = await communityService.sendMessage({
        communityId,
        content,
        media,
        isAnnouncement,
      });
      return newMessage;
    } catch (error) {
      console.error("Failed to send community message:", error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await communityService.deleteMessage(communityId, messageId);
    } catch (error) {
      console.error("Failed to delete community message:", error);
      throw error;
    }
  };

  const summarizeCommunity = async (limit = 50) => {
    try {
      console.warn("summarizeCommunity not implemented yet");
      return { summary: "Not implemented" };
    } catch (error) {
      console.error("Failed to summarize community messages", error);
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    hasMore,
    sendMessage,
    deleteMessage,
    summarizeCommunity,
    refreshMessages: loadMessages,
  };
};
