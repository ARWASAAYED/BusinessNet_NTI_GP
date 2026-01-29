import React from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full animate-[popupEnter_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
          onClick={onClose}
          aria-label="Close popup"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
