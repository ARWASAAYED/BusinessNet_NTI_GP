"use client";

import React, { useState } from 'react';
import { X, Send, Globe as GlobeIcon, Cpu, Briefcase, Landmark, Palette, GraduationCap, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';
import { Post } from '@/services/postService';

interface PostEditModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (content: string, category: string) => Promise<void>;
}

const PostEditModal: React.FC<PostEditModalProps> = ({ post, isOpen, onClose, onUpdate }) => {
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category || 'General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'General', icon: <GlobeIcon className="w-3 h-3" /> },
    { name: 'Technology', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Business', icon: <Briefcase className="w-3 h-3" /> },
    { name: 'Finance', icon: <Landmark className="w-3 h-3" /> },
    { name: 'Marketing', icon: <Palette className="w-3 h-3" /> },
    { name: 'Education', icon: <GraduationCap className="w-3 h-3" /> },
    { name: 'Legal', icon: <Gavel className="w-3 h-3" /> },
  ];

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(content, category);
      onClose();
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Edit Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none min-h-[150px]"
          />

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border ${
                    category === cat.name
                      ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-100 dark:border-gray-800 hover:border-primary-200'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-xl font-black text-sm tracking-wide shadow-xl shadow-primary-500/40 disabled:opacity-40 flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>SAVE CHANGES</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PostEditModal;
