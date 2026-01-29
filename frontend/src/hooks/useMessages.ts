import { useState, useEffect, useCallback } from "react";
import messageService, {
  Message,
  Conversation,
} from "@/services/messageService";
import { useSocket } from "./useSocket";
import { useAuth } from "./useAuth";

export const useMessages = (recipientId?: string) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { on, off } = useSocket();

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      setError(error.message || "Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    try {
      setIsMessagesLoading(true);
      setError(null);
      const data = await messageService.getMessages(id);
      setMessages(data.messages);
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      // For new conversations, there might be no messages yet - that's OK
      setMessages([]); // Set empty messages instead of showing error
      // setError(error.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      // 1. Update current messages if it's the active conversation
      const currentUserId = user?.id || user?._id;
      const isFromRecipient = message.senderId._id === recipientId;
      const isToRecipient = message.receiverId._id === recipientId;

      if (isFromRecipient || isToRecipient) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }

      // 2. Update conversations list
      setConversations((prev) => {
        const otherPersonId =
          message.senderId._id === currentUserId
            ? message.receiverId._id
            : message.senderId._id;

        const existingConvIndex = prev.findIndex((c) =>
          c.participants.some((p) => p._id === otherPersonId)
        );

        if (existingConvIndex > -1) {
          const updatedConv = {
            ...prev[existingConvIndex],
            lastMessage: message,
            updatedAt: message.createdAt,
            unreadCount:
              isFromRecipient && !isToRecipient && !message.isRead
                ? prev[existingConvIndex].unreadCount + 1
                : prev[existingConvIndex].unreadCount,
          };
          const newConvs = [...prev];
          newConvs.splice(existingConvIndex, 1);
          return [updatedConv, ...newConvs];
        } else {
          // Fetch conversations again to get the new one properly structured
          loadConversations();
          return prev;
        }
      });
    },
    [recipientId, user, loadConversations]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (recipientId) {
      loadMessages(recipientId);
    } else {
      setMessages([]);
    }
  }, [recipientId, loadMessages]);

  useEffect(() => {
    on("message", handleNewMessage);
    return () => {
      off("message", handleNewMessage);
    };
  }, [on, off, handleNewMessage]);

  const sendMessage = async (content: string) => {
    if (!recipientId) return;
    try {
      const newMessage = await messageService.sendMessage({
        receiverId: recipientId,
        content,
      });
      // The socket might emit the message back to us, or we add it manually
      // If the backend emits to sender too, we handle it in 'on'
      // For now, let's assume we add it manually for responsiveness if socket doesn't emit to self
      handleNewMessage(newMessage);
      return newMessage;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await messageService.markAsRead(id);
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      setConversations((prev) =>
        prev.map((c) =>
          c.participants.some((p) => p._id === id)
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getAiSuggestion = async (prompt: string, tone?: string) => {
    if (!recipientId) throw new Error("No conversation selected");
    // const result = await messageService.aiReply(recipientId, prompt, tone);
    // return result;
    console.warn("aiReply not implemented");
    return { suggestion: "AI Reply not implemented" };
  };

  return {
    conversations,
    messages,
    isLoading,
    isMessagesLoading,
    error,
    sendMessage,
    markAsRead,
    getAiSuggestion,
    refreshConversations: loadConversations,
    refreshMessages: loadMessages,
  };
};
