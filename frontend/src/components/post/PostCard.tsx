"use client";

import React, { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, MoreHorizontal, Trash2, Edit, ExternalLink, ShieldCheck, Zap, Eye, Copy } from 'lucide-react';
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

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const userId = user?._id || user?.id || '';
  
  const [upvotes, setUpvotes] = useState(post.upvotes || []);
  const [downvotes, setDownvotes] = useState(post.downvotes || []);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [viewCount, setViewCount] = useState(post.impressions || 0);
  const [showComments, setShowComments] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const upvoteList = Array.isArray(upvotes) ? upvotes : [];
  const downvoteList = Array.isArray(downvotes) ? downvotes : [];
  
  const userVote = upvoteList.includes(userId) ? 'up' : downvoteList.includes(userId) ? 'down' : null;
  const score = upvoteList.length - downvoteList.length;

  // Track view when post is displayed
  useEffect(() => {
    if (!hasTrackedView && post._id) {
      const trackView = async () => {
        try {
          const result = await postService.incrementView(post._id);
          setViewCount(result.views);
          setHasTrackedView(true);
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      };
      trackView();
    }
  }, [post._id, hasTrackedView]);

  const getFullUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) return;
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

  const handleShare = async () => {
    try {
      const updatedPost = await postService.sharePost(post._id);
      setShareCount(updatedPost.shareCount || 0);
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('🚨 Are you sure you want to permanently delete this post? This action cannot be undone.')) {
      try {
        await postService.deletePost(post._id);
        onDelete?.(post._id);
        showToast('Post deleted successfully', 'success');
      } catch (error) {
        console.error('Failed to delete post:', error);
        showToast('Failed to delete post. Please try again.', 'error');
      }
    }
  };

  const handleUpdate = async (content: string, category: string) => {
    try {
      await postService.updatePost(post._id, { content, category });
      showToast('Post updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update post:', error);
      showToast('Failed to update post', 'error');
      throw error;
    }
  };

  const handleCopyPost = () => {
    const postUrl = `${window.location.origin}/feed?post=${post._id}`;
    navigator.clipboard.writeText(postUrl);
    showToast('Post link copied to clipboard!', 'success');
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
      label: 'Copy Link',
      onClick: handleCopyPost,
      icon: <Copy className="w-4 h-4" />,
    },
    ...(isOwner
      ? [
          {
            label: 'Edit Post',
            onClick: () => setIsEditModalOpen(true),
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: 'Delete Post',
            onClick: handleDelete,
            icon: <Trash2 className="w-4 h-4" />,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-950 group relative p-0 mb-6 overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Premium Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-0.5 shadow-lg">
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
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors">
                  {post.author?.username || 'Anonymous'}
                </h3>
                {post.author?.accountType === 'business' && (
                  <Badge variant="primary" size="sm" className="text-[10px] uppercase tracking-tighter py-0">Pro</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formatTimeAgo(post.createdAt)}
                </p>
                {post.category && (
                  <span className="text-[10px] font-black uppercase text-primary-500 tracking-tight bg-primary-500/10 px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.professionalismScore && post.professionalismScore > 85 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-success-50 dark:bg-success-900/20 border border-success-500/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-success-500" />
                <span className="text-[9px] font-black text-success-600 dark:text-success-400 uppercase tracking-widest">Verified Content</span>
              </div>
            )}
            {post.isPromoted && (
              <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">Promoted</span>
            )}
            <Dropdown
              trigger={
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              }
              items={dropdownItems}
            />
          </div>
        </div>

        {/* AI Insight (Visible to Owner or Pro users) */}
        {(isOwner || user?.accountType === 'business') && post.professionalismScore !== undefined && (
          <div className="mb-4 p-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <Zap className="w-3 h-3 text-yellow-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Professionalism Score</span>
               </div>
               <span className={`text-xs font-black ${
                 post.professionalismScore > 80 ? 'text-success-500' : 
                 post.professionalismScore > 50 ? 'text-primary-500' : 'text-orange-500'
               }`}>
                 {post.professionalismScore}%
               </span>
             </div>
             <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${post.professionalismScore}%` }}
                 className={`h-full bg-gradient-to-r ${
                   post.professionalismScore > 80 ? 'from-success-400 to-success-600' : 
                   post.professionalismScore > 50 ? 'from-primary-400 to-primary-600' : 'from-orange-400 to-orange-600'
                 }`}
               />
             </div>
             {isOwner && post.professionalismScore < 60 && (
               <p className="mt-2 text-[10px] text-gray-500 font-medium italic">
                 Tip: Adding more technical keywords or structure can boost your reach.
               </p>
             )}
          </div>
        )}

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium leading-relaxed text-[15px]">
            {post.content}
          </p>
        </div>

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
              <span className={`text-sm font-black pr-2 ${
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
              <span className={`text-sm font-black pr-2 ${
                userVote === 'down' ? 'text-secondary-600 dark:text-secondary-400' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {downvoteList.length > 0 && `-${downvoteList.length}`}
              </span>
            </div>
          </div>

          {/* Comment & Share Buttons */}
          <button 
            onClick={() => setShowComments(!showComments)}
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all font-bold text-sm ml-auto sm:ml-0"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">{shareCount} Shares</span>
          </button>

          {/* Engagement Meta */}
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-auto">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {viewCount.toLocaleString()} Views
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
    </motion.div>
  );
};

export default PostCard;
