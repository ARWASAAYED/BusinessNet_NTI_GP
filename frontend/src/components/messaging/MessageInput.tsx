"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";

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
  placeholder = "Type a message...",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4"
    >
      <div className="flex items-end gap-3">
        {/* Emoji Button */}
        <button
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>

        {/* AI Suggest Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={async () => {
              if (!onAiSuggest) return;
              try {
                const res = await onAiSuggest(message || "");
                // If AI returns a suggestion, insert it into the input (replace or append)
                if (res?.suggestion) setMessage(res.suggestion);
              } catch (err) {
                console.error("AI suggestion failed", err);
              }
            }}
            className="flex items-center gap-2 mr-2"
          >
            AI
          </Button>
        </motion.div>

        {/* Send Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!message.trim() || disabled}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default MessageInput;
