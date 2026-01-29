import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  setSocket: (socket: Socket | null) => void;
  setConnected: (connected: boolean) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  setOnlineUsers: (users: string[]) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

  setSocket: (socket) => set({ socket }),

  setConnected: (connected) => set({ isConnected: connected }),

  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.includes(userId)
        ? state.onlineUsers
        : [...state.onlineUsers, userId],
    })),

  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((id) => id !== userId),
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
