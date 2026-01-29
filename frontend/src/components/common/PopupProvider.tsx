"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import Popup, { PopupType } from './Popup';

interface PopupState {
  isOpen: boolean;
  title?: string;
  message: string;
  type: PopupType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface PopupContextType {
  showPopup: (message: string, type?: PopupType, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => void;
  showSuccess: (message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => void;
  showError: (message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => void;
  showWarning: (message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => void;
  showInfo: (message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    message: '',
    type: 'info',
    duration: 5000,
    position: 'top-right',
  });

  const showPopup = useCallback((
    message: string,
    type: PopupType = 'info',
    options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>
  ) => {
    setPopup({
      isOpen: true,
      message,
      type,
      duration: 5000,
      position: 'top-right',
      ...options,
    });
  }, []);

  const showSuccess = useCallback((message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => {
    showPopup(message, 'success', options);
  }, [showPopup]);

  const showError = useCallback((message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => {
    showPopup(message, 'error', options);
  }, [showPopup]);

  const showWarning = useCallback((message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => {
    showPopup(message, 'warning', options);
  }, [showPopup]);

  const showInfo = useCallback((message: string, options?: Partial<Omit<PopupState, 'isOpen' | 'message' | 'type'>>) => {
    showPopup(message, 'info', options);
  }, [showPopup]);

  const closePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <PopupContext.Provider
      value={{
        showPopup,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closePopup,
      }}
    >
      {children}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        duration={popup.duration}
        position={popup.position}
      />
    </PopupContext.Provider>
  );
};
