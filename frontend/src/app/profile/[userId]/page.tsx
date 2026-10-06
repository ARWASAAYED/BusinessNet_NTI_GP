"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Link as LinkIcon, Calendar, MessageCircle, Swords, Image as ImageIcon, Film, Building2, Grid, Play, X, ExternalLink } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import PostList from "@/components/post/PostList";
import Spinner from "@/components/common/Spinner";
import userService, { User } from "@/services/userService";
import postService from "@/services/postService";
import businessService, { Business } from "@/services/businessService";
import messageService from "@/services/messageService";
import { useAuth } from "@/hooks/useAuth";
import DuelChallengeModal from "@/components/duel/DuelChallengeModal";
import FollowListModal from "@/components/profile/FollowListModal";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatDate } from "@/utils/dateHelpers";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { t, locale } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'pages'>('posts');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('following');

  const userId =
    (params?.userId as string) || currentUser?.id || currentUser?._id;

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
      loadPosts(userId);
      loadBusinesses(userId);
    }
  }, [userId]);

  const loadBusinesses = async (id: string) => {
    try {
      const data = await businessService.getUserBusinesses(id);
      setBusinesses(data || []);
    } catch (error) {
      console.error("Failed to load businesses:", error);
      setBusinesses([]);
    }
  };

  const loadProfile = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await userService.getProfile(id);
      setUser(data);

      if (currentUser) {
        const currentUserId = currentUser._id;
        setIsFollowing(
          currentUserId ? data.followers.includes(currentUserId) : false
        );
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPosts = async (id: string) => {
    try {
      setIsLoadingPosts(true);
      const data = await postService.getUserPosts(id);
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;

    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await userService.unfollowUser(user._id);
      } else {
        await userService.followUser(user._id);
      }
    } catch (error) {
      setIsFollowing(isFollowing);
      console.error("Failed to update follow status:", error);
    }
  };

  const handleMessage = async () => {
    if (!user) return;
    try {
      const conversation = await messageService.startConversation(user._id);
      router.push(`/messages/${conversation._id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            User not found
          </p>
        </div>
      </div>
    );
  }

  const currentUserId = currentUser?.id || currentUser?._id;
  const isOwnProfile = currentUserId === user._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar src={user.avatar} alt={user.username} size="xl" />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {user.username}
                  </h1>
                  <Badge
                    variant={
                      user.accountType === "business" ? "primary" : "secondary"
                    }
                  >
                    {user.accountType === "business"
                      ? (t('profile.businessAccount') || "Business Account")
                      : (t('profile.personalAccount') || "Personal Account")}
                  </Badge>
                </div>

                {!isOwnProfile && currentUser && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleFollow}
                      className="px-6"
                    >
                      {isFollowing ? (t('profile.following') || "Following") : (t('profile.follow') || "Follow")}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setIsDuelModalOpen(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white border-none shadow-md shadow-primary-500/20"
                    >
                      <Swords className="w-4 h-4" />
                      {t('battles.title') || "Duel"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleMessage}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('messages.title') || "Message"}
                    </Button>
                  </div>
                )}

                {isOwnProfile && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/settings")}
                  >
                    {t('profile.editProfile') || "Edit Profile"}
                  </Button>
                )}
              </div>


              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setFollowModalType('followers');
                    setFollowModalOpen(true);
                  }}
                  className="group flex items-center transition-all cursor-pointer hover:opacity-80"
                >
                  <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                    {user.followers.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ms-1 text-sm group-hover:underline">
                    {t('profile.followers') || "Followers"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFollowModalType('following');
                    setFollowModalOpen(true);
                  }}
                  className="group flex items-center transition-all cursor-pointer hover:opacity-80"
                >
                  <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                    {user.following.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ms-1 text-sm group-hover:underline">
                    {t('profile.following') || "Following"}
                  </span>
                </button>
              </div>

              {/* Achievements/Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    {t('profile.achievements') || "Professional Achievements"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {user.badges.map((badge: any) => (
                      <div 
                        key={badge._id} 
                        className="group relative flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-2 pr-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-default"
                        title={badge.description}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner
                          ${badge.rarity === 'common' ? 'bg-gray-100 dark:bg-gray-800' : 
                            badge.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                            badge.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/30' : 
                            'bg-emerald-100 dark:bg-emerald-900/30'}`}
                        >
                          {badge.imageUrl || '🏆'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{badge.name}</p>
                          <p className={`text-[10px] font-black uppercase tracking-tighter
                            ${badge.rarity === 'common' ? 'text-gray-400' : 
                              badge.rarity === 'rare' ? 'text-blue-500' : 
                              badge.rarity === 'epic' ? 'text-purple-500' : 
                              'text-emerald-500'}`}
                          >
                            {badge.rarity}
                          </p>
                        </div>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                          {badge.description}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('profile.joined')} {formatDate(user.createdAt, locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-1.5 shadow-sm">
        {[
          { id: 'posts', label: t('profile.posts') || 'Posts', count: posts.length, icon: Grid },
          { 
            id: 'media', 
            label: t('profile.media') || 'Media & Videos', 
            count: posts.reduce((acc, p) => acc + (p.media?.length || 0), 0),
            icon: Film 
          },
          { id: 'pages', label: t('profile.businesses') || 'Pages & Businesses', count: businesses.length, icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-primary-200/50 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'posts' && (
        <div>
          <PostList posts={posts} isLoading={isLoadingPosts} />
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-6">
          {(() => {
            const mediaList = posts.flatMap((p) => {
              if (!p.media || !Array.isArray(p.media)) return [];
              return p.media.map((item: any, i: number) => {
                const url = typeof item === 'string' ? item : item.url;
                const isVideo = item.type === 'video' || (typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i));
                return {
                  id: `${p._id}-${i}`,
                  url,
                  isVideo,
                  postId: p._id,
                  caption: p.content,
                  date: p.createdAt
                };
              });
            });

            if (mediaList.length === 0) {
              return (
                <Card className="p-12 text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <Film className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
                    {t('profile.noMedia') || 'No media or videos yet'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {t('profile.noMediaDesc') || 'Photos and videos shared in posts will appear here.'}
                  </p>
                </Card>
              );
            }

            const getMediaUrl = (url: string) => {
              if (!url) return '';
              if (url.startsWith('http')) return url;
              const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
              return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
            };

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    {item.isVideo ? (
                      <div className="w-full h-full relative bg-gray-950 flex items-center justify-center">
                        <video
                          src={getMediaUrl(item.url)}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-primary-600 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getMediaUrl(item.url)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-white text-xs line-clamp-1 font-medium">{item.caption || 'Media'}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="space-y-6">
          {businesses.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-900/30">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mx-auto mb-4 text-primary-600">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
                {t('profile.noBusinesses') || 'No businesses or pages'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                {t('profile.noBusinessesDesc') || 'This member has not registered or linked any business pages.'}
              </p>
              {isOwnProfile && (
                <Button
                  onClick={() => router.push('/business/register')}
                  variant="primary"
                  size="sm"
                  className="rounded-xl"
                >
                  {t('business.createPage') || 'Create Business Page'}
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz) => {
                const logoUrl = biz.logo ? (biz.logo.startsWith('http') ? biz.logo : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${biz.logo}`) : '';
                return (
                  <Card
                    key={biz._id}
                    onClick={() => router.push(`/business/${biz._id}`)}
                    className="p-5 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-primary-500/30"
                  >
                    <Avatar src={logoUrl} alt={biz.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{biz.name}</h3>
                        {(biz.verified || biz.isVerified) && (
                          <Badge variant="primary" size="sm" className="text-[9px] uppercase">Verified</Badge>
                        )}
                      </div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{biz.category || biz.industry || 'Business'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{biz.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Media Fullscreen Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-black rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center max-h-[75vh] bg-black">
              {selectedMedia.isVideo ? (
                <video
                  src={selectedMedia.url.startsWith('http') ? selectedMedia.url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${selectedMedia.url}`}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-auto max-w-full"
                />
              ) : (
                <img
                  src={selectedMedia.url.startsWith('http') ? selectedMedia.url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${selectedMedia.url}`}
                  alt=""
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              )}
            </div>
            {selectedMedia.caption && (
              <div className="p-4 bg-gray-900 text-white text-xs">
                <p>{selectedMedia.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {user && (
        <DuelChallengeModal 
          opponent={user}
          isOpen={isDuelModalOpen}
          onClose={() => setIsDuelModalOpen(false)}
        />
      )}

      {user && (
        <FollowListModal
          isOpen={followModalOpen}
          onClose={() => setFollowModalOpen(false)}
          userId={user._id || (user as any).id}
          userName={user.username}
          initialType={followModalType}
          onUpdate={() => {
            if (userId) loadProfile(userId);
          }}
        />
      )}
    </div>
  );
}
