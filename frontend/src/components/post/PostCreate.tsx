"use client";

import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, X, Film, Hash, User as UserIcon, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, Cpu, Landmark, Palette, GraduationCap, Gavel, Globe as GlobeIcon } from 'lucide-react';

interface PostCreateProps {
  onSubmit: (content: string, media?: File[], category?: string) => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [category, setCategory] = useState('General');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { name: 'General', icon: <GlobeIcon className="w-3 h-3" /> },
    { name: 'Technology', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Business', icon: <Briefcase className="w-3 h-3" /> },
    { name: 'Finance', icon: <Landmark className="w-3 h-3" /> },
    { name: 'Marketing', icon: <Palette className="w-3 h-3" /> },
    { name: 'Education', icon: <GraduationCap className="w-3 h-3" /> },
    { name: 'Legal', icon: <Gavel className="w-3 h-3" /> },
  ];

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
    }));

    setSelectedMedia(prev => [...prev, ...newMedia]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsExpanded(true);
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && selectedMedia.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content, selectedMedia.map(m => m.file), category);
      setContent('');
      setCategory('General');
      setSelectedMedia(prev => {
        prev.forEach(m => URL.revokeObjectURL(m.preview));
        return [];
      });
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass-card p-6 transition-all duration-500 ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}`}
    >
      <div className="flex gap-4">
        <div className="hidden sm:block">
          <Avatar src={user?.avatar} alt={user?.username || 'User'} size="md" className="border-2 border-primary-500/20" />
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share something professional..."
            className="w-full px-0 py-2 bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none min-h-[40px] transition-all duration-300"
            rows={isExpanded ? 3 : 1}
          />

          {isExpanded && (
            <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 self-center">Category:</span>
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
          )}

          <AnimatePresence>
            {selectedMedia.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
              >
                {selectedMedia.map((media, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                    {media.type === 'video' ? (
                      <video src={media.preview} muted autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={media.preview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-black/40 text-[8px] text-white font-black uppercase rounded backdrop-blur-md">
                      {media.type}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {(isExpanded || content || selectedMedia.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaSelect}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
                <ActionIconButton onClick={() => fileInputRef.current?.click()} icon={<ImageIcon className="w-5 h-5" />} label="Media" color="text-primary-500" />
                <ActionIconButton onClick={() => {
                  setContent(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' #' : '#'));
                  setIsExpanded(true);
                }} icon={<Hash className="w-5 h-5" />} label="Tag" color="text-indigo-500" />
                <ActionIconButton icon={<Smile className="w-5 h-5" />} label="Emoji" color="text-amber-500" />
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setSelectedMedia(prev => {
                      prev.forEach(m => URL.revokeObjectURL(m.preview));
                      return [];
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold transition-colors"
                >
                  Clear
                </button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={(!content.trim() && selectedMedia.length === 0) || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-primary-500/40 disabled:opacity-40 disabled:grayscale transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-primary-500/50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>POST IT</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ActionIconButton = ({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick?: () => void; color: string }) => (
  <button 
    onClick={onClick}
    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all group relative flex items-center gap-2 ${color}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute left-full whitespace-nowrap bg-white dark:bg-gray-950 px-2 py-1 rounded-md shadow-lg pointer-events-none z-50">
      {label}
    </span>
  </button>
);

export default PostCreate;
