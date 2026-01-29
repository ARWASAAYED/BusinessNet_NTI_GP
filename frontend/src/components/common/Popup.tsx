"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type PopupType = 'success' | 'error' | 'warning' | 'info';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: PopupType;
  duration?: number; // Auto-close duration in milliseconds (0 = no auto-close)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showCloseButton?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-success-500" />,
    error: <AlertCircle className="w-6 h-6 text-error-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-warning-500" />,
    info: <Info className="w-6 h-6 text-info-500" />,
  };

  const bgColors = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    error: 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800',
  };

  const textColors = {
    success: 'text-success-700 dark:text-success-300',
    error: 'text-error-700 dark:text-error-300',
    warning: 'text-warning-700 dark:text-warning-300',
    info: 'text-info-700 dark:text-info-300',
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed ${positionClasses[position]} z-50 max-w-md w-full mx-4`}
        >
          <div
            className={`glass-effect rounded-xl shadow-2xl border-2 ${bgColors[type]} p-4 backdrop-blur-md`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex-shrink-0 mt-0.5"
              >
                {icons[type]}
              </motion.div>

              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className={`text-sm font-semibold mb-1 ${textColors[type]}`}>
                    {title}
                  </h3>
                )}
                <p className={`text-sm ${textColors[type]} opacity-90`}>
                  {message}
                </p>
              </div>

              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${textColors[type]} opacity-70 hover:opacity-100`}
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Progress bar for auto-close */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 rounded-b-xl opacity-60"
                style={{
                  background: type === 'success' 
                    ? 'linear-gradient(90deg, hsl(var(--success-500)), hsl(var(--success-600)))'
                    : type === 'error'
                    ? 'linear-gradient(90deg, hsl(var(--error-500)), hsl(var(--error-600)))'
                    : type === 'warning'
                    ? 'linear-gradient(90deg, hsl(var(--warning-500)), hsl(var(--warning-600)))'
                    : 'linear-gradient(90deg, hsl(var(--info-500)), hsl(var(--info-600)))',
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
