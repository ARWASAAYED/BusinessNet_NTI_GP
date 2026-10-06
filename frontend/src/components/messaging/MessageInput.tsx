"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface MessageInputProps {
  onSend: (content: string) => void;
  onAiSuggest?: (
    prompt?: string,
    tone?: string
  ) => Promise<{ suggestion: string; analysis?: any }>;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onAiSuggest,
  placeholder,
  disabled = false,
}) => {
  const { t, isRTL } = useLanguage();
  const [message, setMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputPlaceholder = placeholder || t('messages.typeMessage');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSend(message.trim());
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAiClick = async () => {
    if (!onAiSuggest || isAiLoading) return;
    try {
      setIsAiLoading(true);
      const res = await onAiSuggest(message || "");
      if (res?.suggestion) {
        setMessage(res.suggestion);
      }
    } catch (err) {
      console.error("AI suggestion failed", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-3 sm:p-4 shrink-0"
    >
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Emoji Button */}
        <button
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors shrink-0"
          aria-label="Add emoji"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors shrink-0"
          aria-label="Attach file"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm leading-relaxed"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>

        {/* AI Suggest Button */}
        {onAiSuggest && (
          <motion.div whileTap={{ scale: 0.95 }} className="shrink-0">
            <button
              type="button"
              disabled={disabled || isAiLoading}
              onClick={handleAiClick}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="AI Message Polish"
            >
              <Sparkles className={`w-4 h-4 text-primary-500 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('messages.aiAssist')}</span>
            </button>
          </motion.div>
        )}

        {/* Send Button */}
        <motion.div whileTap={{ scale: 0.95 }} className="shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!message.trim() || disabled}
            className="rounded-xl px-4 py-2.5 flex items-center gap-1.5 shadow-sm shadow-primary-500/20"
          >
            <span className="hidden sm:inline">{t('messages.send')}</span>
            <Send className={`w-4 h-4 ${isRTL ? '-scale-x-100' : ''}`} />
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default MessageInput;
