import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: "text" | "image" | "file";
  metadata?: Record<string, any>;
}

interface Conversation {
  _id: string;
  participants: any[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  currentUserId?: string;
}

class ChatService {
  private socket: Socket | null = null;
  private messageListeners: Set<(message: Message) => void> = new Set();
  private conversationListeners: Set<(conversations: Conversation[]) => void> =
    new Set();
  private statusListeners: Set<
    (status: { userId: string; isOnline: boolean }) => void
  > = new Set();

  /**
   * Initialize Socket.io connection
   */
  initializeSocket(userId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket?.connected) {
          resolve();
          return;
        }

        this.socket = io(SOCKET_URL, {
          auth: {
            userId,
            token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
          console.log("Socket connected:", this.socket?.id);
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        this.socket.on("new_message", (message: Message) => {
          this.messageListeners.forEach((listener) => listener(message));
        });

        this.socket.on(
          "user_status",
          (status: { userId: string; isOnline: boolean }) => {
            this.statusListeners.forEach((listener) => listener(status));
          }
        );

        this.socket.on("error", (error) => {
          console.error("Socket error:", error);
        });

        setTimeout(() => {
          reject(new Error("Socket connection timeout"));
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(
    conversationId: string,
    limit = 50,
    offset = 0
  ): Promise<Message[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/${conversationId}`,
        {
          params: { limit, offset },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    content: string,
    type: "text" | "image" | "file" = "text"
  ): Promise<Message> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        {
          conversationId,
          content,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Emit via socket for real-time update
      if (this.socket?.connected) {
        this.socket.emit("send_message", response.data.data);
      }

      return response.data.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      await axios.patch(
        `${API_BASE_URL}/messages/${conversationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Notify via socket
      if (this.socket?.connected) {
        this.socket.emit("messages_read", { conversationId });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(recipientId: string): Promise<Conversation> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/conversations`,
        { recipientId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Notify via socket
      if (this.socket?.connected) {
        this.socket.emit("conversation_deleted", { conversationId });
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  }

  /**
   * Block a user
   */
  async blockUser(userId: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/users/${userId}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  }

  /**
   * Unblock a user
   */
  async unblockUser(userId: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/users/${userId}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  }

  /**
   * Get typing status
   */
  emitTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit("typing", { conversationId, isTyping });
    }
  }

  /**
   * Subscribe to new messages
   */
  onNewMessage(callback: (message: Message) => void): () => void {
    this.messageListeners.add(callback);
    return () => this.messageListeners.delete(callback);
  }

  /**
   * Subscribe to conversation updates
   */
  onConversationUpdate(
    callback: (conversations: Conversation[]) => void
  ): () => void {
    this.conversationListeners.add(callback);
    return () => this.conversationListeners.delete(callback);
  }

  /**
   * Subscribe to user status changes
   */
  onUserStatusChange(
    callback: (status: { userId: string; isOnline: boolean }) => void
  ): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const chatService = new ChatService();
