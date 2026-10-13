"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Sparkles, X, Image as ImageIcon, Film, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface MediaAttachment {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface MessageInputProps {
  onSend: (content: string, media?: File[]) => void;
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
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Revoke object URLs on cleanup
  useEffect(() => {
    return () => {
      attachments.forEach(a => URL.revokeObjectURL(a.preview));
    };
  }, []);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newAttachments: MediaAttachment[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    setIsUploading(attachments.length > 0);
    try {
      await onSend(message.trim(), attachments.map(a => a.file));
      setMessage("");
      attachments.forEach(a => URL.revokeObjectURL(a.preview));
      setAttachments([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setIsUploading(false);
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

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !disabled && !isUploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shrink-0"
    >
      {/* Media Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pt-3 flex gap-2 flex-wrap"
          >
            {attachments.map((att, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0"
              >
                {att.type === "video" ? (
                  <video
                    src={att.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={att.preview}
                    alt="Attachment"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Type badge */}
                <div className="absolute top-1 start-1 p-0.5 bg-black/50 rounded-md text-white">
                  {att.type === "video" ? (
                    <Film className="w-2.5 h-2.5" />
                  ) : (
                    <ImageIcon className="w-2.5 h-2.5" />
                  )}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 end-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">
        {/* Emoji Button */}
        <button
          type="button"
          className="hidden sm:block p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors shrink-0"
          aria-label="Add emoji"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Media attachment hidden input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaSelect}
          multiple
          accept="image/*,video/*"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-xl transition-colors shrink-0"
          aria-label="Attach media"
          title={t('feed.media')}
          disabled={disabled}
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
            disabled={!canSend}
            className="rounded-xl px-4 py-2.5 flex items-center gap-1.5 shadow-sm shadow-primary-500/20"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">{t('messages.send')}</span>
                <Send className={`w-4 h-4 ${isRTL ? '-scale-x-100' : ''}`} />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default MessageInput;
