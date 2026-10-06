"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, MoreHorizontal, Trash2, Edit, ExternalLink, Eye, Copy, Repeat, Users, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import postService, { Post } from '@/services/postService';
import { formatTimeAgo } from '@/utils/dateHelpers';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import CommentList from '../comment/CommentList';
import { useAuth } from '@/hooks/useAuth';
import Badge from '../common/Badge';
import { useRouter } from 'next/navigation';
import PostEditModal from './PostEditModal';
import { useToast } from '@/app/providers';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, locale, isRTL } = useLanguage();
  const router = useRouter();
  const userId = user?._id || user?.id || '';
  
  const [upvotes, setUpvotes] = useState(post.upvotes || []);
  const [downvotes, setDownvotes] = useState(post.downvotes || []);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [viewCount, setViewCount] = useState(post.impressions || 0);
  const [uniqueViewCount, setUniqueViewCount] = useState(post.uniqueViews || 0);
  const [showComments, setShowComments] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quoteContent, setQuoteContent] = useState('');
  const [isReposting, setIsReposting] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const upvoteList = Array.isArray(upvotes) ? upvotes : [];
  const downvoteList = Array.isArray(downvotes) ? downvotes : [];
  
  const userVote = upvoteList.includes(userId) ? 'up' : downvoteList.includes(userId) ? 'down' : null;
  const score = upvoteList.length - downvoteList.length;

  // Track view when post is visible in viewport
  useEffect(() => {
    const postElement = containerRef.current;
    if (!postElement || hasTrackedView || !post._id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const trackView = async () => {
            try {
              const result = await postService.incrementView(post._id);
              setViewCount(result.views);
              setUniqueViewCount(result.uniqueViews);
              setHasTrackedView(true);
            } catch (error) {
              console.error('Failed to track view:', error);
            }
          };
          trackView();
        }
      },
      { threshold: 0.5 } // Post must be at least 50% visible
    );

    observer.observe(postElement);

    return () => {
      if (postElement) observer.unobserve(postElement);
    };
  }, [post._id, hasTrackedView]);

  const getFullUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      showToast(t('feed.signInToVote'), 'info');
      router.push('/login');
      return;
    }
    try {
      const updatedPost = await postService.votePost(post._id, type);
      setUpvotes(updatedPost.upvotes || []);
      setDownvotes(updatedPost.downvotes || []);
      if (type === 'up' && onLike) {
        onLike(post._id);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleInstantRepost = async () => {
    if (!user) {
      showToast(t('feed.signInToRepost'), 'info');
      router.push('/login');
      return;
    }
    setIsReposting(true);
    try {
      await postService.repostPost(post._id);
      setShareCount((prev) => prev + 1);
      showToast(t('feed.reposted'), 'success');
      setIsShareModalOpen(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || t('feed.repostFailed'), 'error');
    } finally {
      setIsReposting(false);
    }
  };

  const handleQuoteRepost = async () => {
    if (!user) {
      showToast(t('feed.signInToRepost'), 'info');
      router.push('/login');
      return;
    }
    if (!quoteContent.trim()) return;
    setIsReposting(true);
    try {
      await postService.repostPost(post._id, quoteContent.trim());
      setShareCount((prev) => prev + 1);
      showToast(t('feed.quoted'), 'success');
      setQuoteContent('');
      setIsShareModalOpen(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || t('feed.repostFailed'), 'error');
    } finally {
      setIsReposting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postService.deletePost(post._id);
      onDelete?.(post._id);
      showToast(t('feed.deleted'), 'success');
    } catch (error) {
      console.error('Failed to delete post:', error);
      showToast(t('feed.deleteFailed'), 'error');
    }
  };

  const handleUpdate = async (content: string, category: string) => {
    try {
      await postService.updatePost(post._id, { content, category });
      showToast(t('feed.updated'), 'success');
    } catch (error) {
      console.error('Failed to update post:', error);
      showToast(t('feed.updateFailed'), 'error');
      throw error;
    }
  };

  const handleCopyPost = () => {
    const postUrl = `${window.location.origin}/feed?post=${post._id}`;
    navigator.clipboard.writeText(postUrl);
    showToast(t('feed.linkCopied'), 'success');
  };

  const handleUserClick = () => {
    const profileId = post.author?._id || post.authorId;
    if (profileId) {
      router.push(`/profile/${profileId}`);
    }
  };

  const isOwner = userId === post.author?._id || userId === post.authorId;

  const dropdownItems = [
    {
      label: t('feed.shareRepost'),
      onClick: handleShare,
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      label: t('feed.copyLink'),
      onClick: handleCopyPost,
      icon: <Copy className="w-4 h-4" />,
    },
    ...(isOwner
      ? [
          {
            label: t('feed.editPost'),
            onClick: () => setIsEditModalOpen(true),
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: t('feed.deletePost'),
            onClick: handleDelete,
            icon: <Trash2 className="w-4 h-4" />,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-950 group relative p-0 mb-6 overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Premium Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Repost Header if applicable */}
      {post.isRepost && (
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/30">
          <Repeat className="w-3.5 h-3.5 text-primary-500" />
          <span>{t('feed.repostedBy')} <strong className="text-gray-900 dark:text-gray-100">{post.author?.username || 'Member'}</strong></span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
            >
              <Avatar src={post.author?.avatar} alt={post.author?.username || 'User'} size="md" />
              {post.isPromoted && (
                <div className="absolute -bottom-1 -end-1 bg-primary-500 text-white rounded-full p-0.5 shadow-lg">
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors">
                  {post.author?.username || 'Anonymous'}
                </h3>
                {post.author?.accountType === 'business' && (
                  <Badge variant="primary" size="sm" className="text-[10px] uppercase tracking-tighter py-0">Pro</Badge>
                )}
                {post.community && (
                  <Link 
                    href={`/communities/${post.community._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline bg-primary-50 dark:bg-primary-950/70 border border-primary-200/80 dark:border-primary-800/80 px-2 py-0.5 rounded-full transition-all"
                  >
                    <Users className="w-3 h-3" />
                    <span>c/{post.community.name}</span>
                    {post.community.isPrivate ? (
                      <span className="flex items-center gap-0.5 text-[9px] text-amber-600 dark:text-amber-400" title="Private Community Post (Visible to members only)">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{t('feed.private')}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400">{t('feed.public')}</span>
                    )}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formatTimeAgo(post.createdAt, locale)}
                </p>
                {post.category && (
                  <span className="text-[10px] font-black uppercase text-primary-500 tracking-tight bg-primary-500/10 px-2 py-0.5 rounded-md">
                    {t(`categories.${post.category}`, post.category)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
          {post.isPromoted && (
              <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">{t('feed.promoted')}</span>
            )}
            <Dropdown
              align="end"
              trigger={
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              }
              items={dropdownItems}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium leading-relaxed text-[15px]">
            {(() => {
              if (!post.content) return null;
              const hashtagRegex = /(#[a-zA-Z0-9_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)/g;
              const parts = post.content.split(hashtagRegex);
              return parts.map((part, index) => {
                if (part.startsWith('#')) {
                  return (
                    <Link
                      key={index}
                      href={`/search?q=${encodeURIComponent(part)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
                    >
                      {part}
                    </Link>
                  );
                }
                return part;
              });
            })()}
          </p>
        </div>

        {/* Quoted Original Post if Repost with original post */}
        {post.originalPost && (
          <div className="mb-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900/80 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Avatar src={post.originalPost.author?.avatar} alt={post.originalPost.author?.username || 'User'} size="sm" />
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {post.originalPost.author?.username || 'User'}
                </span>
                <span className="text-[10px] text-gray-400 ms-2">
                  {formatTimeAgo(post.originalPost.createdAt, locale)}
                </span>
              </div>
              {post.originalPost.community && (
                <span className="ms-auto text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-full">
                  c/{post.originalPost.community.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-medium whitespace-pre-wrap">
              {post.originalPost.content}
            </p>
            {post.originalPost.media && post.originalPost.media.length > 0 && (
              <div className="mt-2 rounded-xl overflow-hidden max-h-48">
                <img 
                  src={getFullUrl(post.originalPost.media[0].url)} 
                  alt="" 
                  className="w-full h-full object-cover max-h-48"
                />
              </div>
            )}
          </div>
        )}

        {/* Media Grid */}
        {post.media && post.media.length > 0 && (
          <div className={`mb-4 grid gap-3 rounded-2xl overflow-hidden ${
            post.media.length === 1 ? 'grid-cols-1' : 
            post.media.length === 2 ? 'grid-cols-2' : 
            'grid-cols-2'
          }`}>
            {post.media.map((item, index) => (
              <div key={index} className={`relative group/media overflow-hidden bg-gray-100 dark:bg-gray-900 ${
                post.media && post.media.length === 3 && index === 0 ? 'row-span-2' : ''
              }`}>
                {item.type === 'video' ? (
                  <video 
                    src={getFullUrl(item.url)} 
                    controls 
                    className="w-full h-full object-cover max-h-[500px]"
                  />
                ) : (
                  <img
                    src={getFullUrl(item.url)}
                    alt=""
                    className="w-full h-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          {/* Enhanced Voting */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => handleVote('up')}
                className={`p-2 rounded-xl transition-all ${
                  userVote === 'up' 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40' 
                    : 'text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ArrowBigUp className={`w-6 h-6 ${userVote === 'up' ? 'fill-current' : ''}`} />
              </motion.button>
              <span className={`text-sm font-black pe-2 ${
                userVote === 'up' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {upvoteList.length > 0 && `+${upvoteList.length}`}
              </span>
            </div>

            <div className="w-[1px] h-6 bg-gray-200 dark:border-gray-800 mx-1" />
            
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => handleVote('down')}
                className={`p-2 rounded-xl transition-all ${
                  userVote === 'down' 
                    ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/40' 
                    : 'text-gray-400 hover:text-secondary-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ArrowBigDown className={`w-6 h-6 ${userVote === 'down' ? 'fill-current' : ''}`} />
              </motion.button>
              <span className={`text-sm font-black pe-2 ${
                userVote === 'down' ? 'text-secondary-600 dark:text-secondary-400' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {downvoteList.length > 0 && `-${downvoteList.length}`}
              </span>
            </div>
          </div>

          {/* Comment & Share Buttons */}
          <button 
            onClick={() => {
              setShowComments(!showComments);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all font-bold text-sm ${
              showComments 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount || 0}</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all font-bold text-sm ms-auto sm:ms-0"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">{shareCount} {t('feed.shares')}</span>
          </button>

          {/* Engagement Meta */}
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 ms-auto">
            <span className="flex items-center gap-1.5" title={`${viewCount} Total Impressions`}>
              <Eye className="w-3.5 h-3.5" />
              {uniqueViewCount.toLocaleString()} {t('feed.reach')}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-6"
            >
              <CommentList postId={post._id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PostEditModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />

      {/* Share / Repost Interactive Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary-500" />
                  <span>{t('feed.shareRepost')}</span>
                </h3>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Instant Repost Button */}
                <button
                  onClick={handleInstantRepost}
                  disabled={isReposting}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('feed.shareRepost').split('/')[0].trim()}</h4>
                    <p className="text-xs text-gray-500">{t('feed.reposted')}</p>
                  </div>
                </button>

                {/* Quote Repost Option */}
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                    <Edit className="w-4 h-4 text-secondary-500" />
                    <span>{t('feed.quoteThoughts')}</span>
                  </div>
                  <textarea
                    value={quoteContent}
                    onChange={(e) => setQuoteContent(e.target.value)}
                    placeholder={t('feed.quotePlaceholder')}
                    dir="auto"
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleQuoteRepost}
                    disabled={isReposting || !quoteContent.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-500/20"
                  >
                    {isReposting ? t('common.loading') : t('feed.repostWithThoughts')}
                  </button>
                </div>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    handleCopyPost();
                    setIsShareModalOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-left"
                >
                  <Copy className="w-4 h-4 text-gray-400 ml-1" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('feed.copyLink')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
