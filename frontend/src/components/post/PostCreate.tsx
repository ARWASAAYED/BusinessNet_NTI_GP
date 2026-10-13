"use client";

import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, X, Film, Hash, Smile, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { Briefcase, Cpu, Landmark, Palette, GraduationCap, Gavel, Globe as GlobeIcon } from 'lucide-react';

interface PostCreateProps {
  onSubmit: (content: string, media?: File[], category?: string) => Promise<void> | void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_MEDIA_COUNT = 5;

const PostCreate: React.FC<PostCreateProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [category, setCategory] = useState('General');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { name: 'General', icon: <GlobeIcon className="w-3 h-3" /> },
    { name: 'Technology', icon: <Cpu className="w-3 h-3" /> },
    { name: 'Business', icon: <Briefcase className="w-3 h-3" /> },
    { name: 'Finance', icon: <Landmark className="w-3 h-3" /> },
    { name: 'Marketing', icon: <Palette className="w-3 h-3" /> },
    { name: 'Education', icon: <GraduationCap className="w-3 h-3" /> },
    { name: 'Legal', icon: <Gavel className="w-3 h-3" /> },
  ];

  const handleFiles = (incomingFiles: File[]) => {
    setErrorMessage(null);
    if (!incomingFiles || incomingFiles.length === 0) return;

    if (selectedMedia.length + incomingFiles.length > MAX_MEDIA_COUNT) {
      setErrorMessage(
        isRTL
          ? `الحد الأقصى المسموح به هو ${MAX_MEDIA_COUNT} ملفات`
          : `Maximum of ${MAX_MEDIA_COUNT} files allowed`
      );
      return;
    }

    const validMedia: { file: File; preview: string; type: 'image' | 'video' }[] = [];

    for (const file of incomingFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(
          isRTL
            ? `الملف ${file.name} يتجاوز الحجم المسموح به (100 ميجابايت)`
            : `File ${file.name} exceeds 100MB size limit`
        );
        continue;
      }

      const isVideo =
        file.type.startsWith('video/') ||
        /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name);

      validMedia.push({
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
      });
    }

    if (validMedia.length > 0) {
      setSelectedMedia(prev => [...prev, ...validMedia]);
      setIsExpanded(true);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if ((!content.trim() && selectedMedia.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onSubmit(content, selectedMedia.map(m => m.file), category);
      setContent('');
      setCategory('General');
      setSelectedMedia(prev => {
        prev.forEach(m => URL.revokeObjectURL(m.preview));
        return [];
      });
      setIsExpanded(false);
    } catch (error: any) {
      console.error('Failed to create post:', error);
      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        (isRTL ? 'فشل نشر المنشور' : 'Failed to publish post')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasVideo = selectedMedia.some(m => m.type === 'video');

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass-card p-6 transition-all duration-500 ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}`}
    >
      <div className="flex gap-4">
        <div className="hidden sm:block">
          <Avatar 
            src={user?.avatar} 
            alt={user?.username || 'User'} 
            size="md" 
            className="border-2 border-primary-500/20" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            {!user && isExpanded && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80 px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800/60">
                {t('feed.guestBrowsing')}
              </span>
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={user ? t('feed.createPost') : t('feed.guestPlaceholder')}
            className="w-full px-0 py-2 bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none min-h-[40px] transition-all duration-300"
            rows={isExpanded ? 3 : 1}
            disabled={isSubmitting}
          />

          {errorMessage && (
            <div className="my-2 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {isExpanded && (
            <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 self-center">{t('feed.categoryLabel')}:</span>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  disabled={isSubmitting}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border ${
                    category === cat.name
                      ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-100 dark:border-gray-800 hover:border-primary-200'
                  }`}
                >
                  {cat.icon}
                  {t(`categories.${cat.name}`, cat.name)}
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
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-800">
                    {media.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video 
                          src={media.preview} 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                          <div className="p-2 bg-black/60 rounded-full text-white backdrop-blur-sm">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={media.preview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    
                    {!isSubmitting && (
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute top-1.5 end-1.5 p-1.5 bg-black/70 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    <div className="absolute top-1.5 start-1.5 px-2 py-0.5 bg-black/60 text-[9px] text-white font-black uppercase rounded backdrop-blur-md flex items-center gap-1">
                      {media.type === 'video' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                      <span>{media.type}</span>
                    </div>

                    <div className="absolute bottom-1.5 start-1.5 px-1.5 py-0.5 bg-black/50 text-[8px] text-white/90 font-medium rounded backdrop-blur-sm">
                      {(media.file.size / (1024 * 1024)).toFixed(1)} MB
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
                {/* Image upload */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/*"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <ActionIconButton 
                  onClick={() => imageInputRef.current?.click()} 
                  icon={<ImageIcon className="w-5 h-5" />} 
                  label={t('feed.photo') || 'Photo'} 
                  color="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40" 
                  disabled={isSubmitting}
                />

                {/* Video upload */}
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoSelect}
                  multiple
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,video/*"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <ActionIconButton 
                  onClick={() => videoInputRef.current?.click()} 
                  icon={<Film className="w-5 h-5" />} 
                  label={t('feed.video') || 'Video'} 
                  color="text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40" 
                  disabled={isSubmitting}
                />

                <ActionIconButton 
                  onClick={() => {
                    setContent(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' #' : '#'));
                    setIsExpanded(true);
                  }} 
                  icon={<Hash className="w-5 h-5" />} 
                  label={t('feed.tag')} 
                  color="text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40" 
                  disabled={isSubmitting}
                />
                
                <ActionIconButton 
                  icon={<Smile className="w-5 h-5" />} 
                  label={t('feed.emoji')} 
                  color="text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40" 
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-3 ms-auto">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setSelectedMedia(prev => {
                      prev.forEach(m => URL.revokeObjectURL(m.preview));
                      return [];
                    });
                    setErrorMessage(null);
                  }}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold transition-colors disabled:opacity-40"
                >
                  {t('feed.clear')}
                </button>
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  onClick={handleSubmit}
                  disabled={(!content.trim() && selectedMedia.length === 0) || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-primary-500/40 disabled:opacity-40 disabled:grayscale transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-primary-500/50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{hasVideo ? (isRTL ? "جاري رفع الفيديو..." : "Uploading video...") : (isRTL ? "جاري النشر..." : "Publishing...")}</span>
                    </div>
                  ) : (
                    <>
                      <span>{user ? t('feed.postIt') : t('feed.postAsGuest')}</span>
                      <Send className={`w-4 h-4 ${isRTL ? '-scale-x-100' : ''}`} />
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

const ActionIconButton = ({
  icon,
  label,
  onClick,
  color,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  color: string;
  disabled?: boolean;
}) => (
  <button 
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2.5 rounded-xl transition-all group relative flex items-center gap-2 disabled:opacity-40 ${color}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all absolute start-full whitespace-nowrap bg-white dark:bg-gray-950 px-2 py-1 rounded-md shadow-lg pointer-events-none z-50">
      {label}
    </span>
  </button>
);

export default PostCreate;

