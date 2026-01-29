"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Info, TrendingUp, Target, BarChart3, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import PromotionList from '@/components/promotion/PromotionList';
import PromotionForm from '@/components/promotion/PromotionForm';
import postService, { Post } from '@/services/postService';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';

import { useRouter } from 'next/navigation';

export default function PromotionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showTips, setShowTips] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const businessId = user?.businessId || (user?.accountType === 'business' ? user?._id : undefined);

  useEffect(() => {
    if (isCreating && businessId) {
      const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
          const data = await postService.getBusinessPosts(businessId);
          setMyPosts(data.posts || []);
        } catch (error) {
          console.error('Failed to fetch business posts:', error);
        } finally {
          setIsLoadingPosts(false);
        }
      };
      fetchPosts();
    }
  }, [isCreating, businessId]);

  const handleSuccess = () => {
    setIsCreating(false);
    setSelectedPost(null);
    // Force refresh the list by re-mounting logic is handled by PromotionList internal effect usually, 
    // but here we might need a signal if we want instant update.
    window.location.reload(); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400">
            <Megaphone className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Campaign Manager</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Boost your visibility and reach target professionals</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div
                key="create-flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {!selectedPost ? (
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Select a Post</h2>
                        <p className="text-sm text-gray-500">Choose which content you want to promote today.</p>
                      </div>
                      <button 
                        onClick={() => setIsCreating(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>

                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Filter your posts..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 ring-primary-500 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {isLoadingPosts ? (
                      <div className="py-20 flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Retrieving Timeline...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {myPosts
                          .filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(post => (
                          <div 
                            key={post._id}
                            onClick={() => setSelectedPost(post)}
                            className="p-5 rounded-2xl border-2 border-transparent hover:border-primary-500 bg-white dark:bg-gray-900 cursor-pointer transition-all group relative overflow-hidden"
                          >
                            <p className="text-gray-900 dark:text-gray-100 font-medium line-clamp-2 mb-3">{post.content}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{post.commentCount} Comments</span>
                              {post.isPromoted && <span className="text-primary-500">Already Promoted</span>}
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-6 h-6 text-primary-500" />
                            </div>
                          </div>
                        ))}
                        {myPosts.length === 0 && (
                          <div className="text-center py-20 space-y-6">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                              <Megaphone className="w-10 h-10 text-gray-400" />
                            </div>
                            <div className="max-w-xs mx-auto">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No content to promote</h3>
                              <p className="text-sm text-gray-500 mb-6">You need to share a professional update or an announcement before you can launch a campaign.</p>
                              <Button 
                                onClick={() => router.push('/feed')}
                                className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Create Your First Post
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <button 
                        onClick={() => setSelectedPost(null)}
                        className="text-sm font-bold text-primary-600 hover:underline"
                      >
                        ← Back to Selection
                      </button>
                    </div>
                    <PromotionForm 
                      postId={selectedPost._id}
                      postContent={selectedPost.content}
                      onSuccess={handleSuccess}
                      onCancel={() => setIsCreating(false)}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="campaign-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Live Campaigns</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                    Real-time tracking active
                  </div>
                </div>
                <PromotionList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Stats & Tips */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats */}
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-20 h-20" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Network Impact
            </h3>
            <div className="space-y-6 relative">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Reach</p>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100">42,890</p>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-2">
                  <div className="w-[70%] bg-primary-500 h-full rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Conversions</p>
                  <p className="font-bold text-lg text-success-500">+12%</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">ROI</p>
                  <p className="font-bold text-lg text-primary-500">3.4x</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Optimization Tips */}
          {showTips && (
            <Card className="p-6 border-primary-100 dark:border-primary-900/30 bg-primary-50/30 dark:bg-primary-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-bold">
                  <Target className="w-5 h-5" />
                  Campaign Tips
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                  Posts with high-quality images have a 40% higher engagement rate.
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                  Targeting specific industries like "Tech" increases conversion by 2x.
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                  Promote on Tuesdays and Thursdays for maximum professional reach.
                </li>
              </ul>
            </Card>
          )}

          {/* Help Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-500/20">
            <Info className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-primary-100 text-sm mb-4 leading-relaxed">
              Our advertising specialists can help you optimize your campaign for better results.
            </p>
            <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
