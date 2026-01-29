"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`glass-effect rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden border border-primary-200/50 dark:border-primary-800/50`}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 gradient-text">{title}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white/50 dark:bg-gray-900/50 transition-smooth">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
