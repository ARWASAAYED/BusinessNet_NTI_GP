"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = 'Write a comment...',
  submitLabel = 'Comment',
  initialValue = '',
}) => {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSubmit(content.trim());
    setContent('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div
        className={`relative rounded-lg border-2 transition-all duration-200 ${
          isFocused
            ? 'border-primary-500 ring-4 ring-primary-100'
            : 'border-gray-200'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full px-4 py-3 rounded-lg resize-none focus:outline-none bg-transparent"
          style={{ minHeight: '44px', maxHeight: '200px' }}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim()}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitLabel}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default CommentForm;
