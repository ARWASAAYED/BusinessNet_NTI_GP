import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface UseSocketOptions {
  autoConnect?: boolean;
}

let socketInstance: Socket | null = null;

export const useSocket = (url?: string, options: UseSocketOptions = {}) => {
  const { autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(socketInstance?.connected || false);
  const { token } = useAuthStore();
  const socketUrl = url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!autoConnect || !token) return;

    if (!socketInstance) {
      socketInstance = io(socketUrl, {
        autoConnect: true,
        auth: { token }
      });
    } else {
      // Update token if changed
      socketInstance.auth = { token };
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
    }

    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    const onError = (error: any) => {
      // Avoid spamming the same error
      console.warn('Socket connection error:', error.message || error);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onError);

    return () => {
      if (socketInstance) {
        socketInstance.off('connect', onConnect);
        socketInstance.off('disconnect', onDisconnect);
        socketInstance.off('connect_error', onError);
      }
    };
  }, [socketUrl, autoConnect, token]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketInstance?.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (callback) {
      socketInstance?.off(event, callback);
    } else {
      socketInstance?.off(event);
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketInstance?.connected) {
      socketInstance.emit(event, data);
    } else {
      console.warn(`Socket not connected. Cannot emit: ${event}`);
    }
  }, []);

  const connect = useCallback(() => {
    if (socketInstance && !socketInstance.connected) {
      socketInstance.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketInstance && socketInstance.connected) {
      socketInstance.disconnect();
    }
  }, []);

  return {
    socket: socketInstance,
    isConnected,
    on,
    off,
    emit,
    connect,
    disconnect,
  };
};
