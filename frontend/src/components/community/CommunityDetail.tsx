"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Settings,
  Share2,
  MoreHorizontal,
  Shield,
  Globe,
  Lock,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import communityService, { Community } from "@/services/communityService";
import postService, { Post } from "@/services/postService";
import { useAuth } from "@/hooks/useAuth";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Spinner from "../common/Spinner";
import PostCard from "../post/PostCard";
import PostCreate from "../post/PostCreate";
import MemberList from "@/components/community/MemberList";
import CommunityChat from "@/components/community/CommunityChat";

interface CommunityDetailProps {
  communityId: string;
}

export default function CommunityDetail({ communityId }: CommunityDetailProps) {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "posts" | "chat" | "members" | "about" | "manage"
  >("posts");

  const getFullUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [commData, postsData] = await Promise.all([
          communityService.getCommunity(communityId),
          postService.getCommunityPosts(communityId),
        ]);
        setCommunity(commData);
        // Mock filtering posts for this community (using hashtags or just some sample filter)
        setPosts(postsData.posts);

        const currentUserId = user?._id;
        if (currentUserId && commData.members.includes(currentUserId)) {
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Failed to load community profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (communityId) loadData();
  }, [communityId, user]);

  const handleJoinLeave = async () => {
    if (!community) return;
    try {
      if (isJoined) {
        await communityService.leaveCommunity(communityId);
        setIsJoined(false);
      } else {
        await communityService.joinCommunity(communityId);
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Join/Leave action failed:", error);
    }
  };

  const handleCreatePost = async (content: string, media?: File[]) => {
    try {
      const newPost = await postService.createPost({
        content,
        category: community?.category || "General",
        communityId: community?._id,
        media,
      });
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Failed to create community post:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!community) {
    return (
      <Card className="p-10 text-center">
        <p className="text-gray-500">Community not found</p>
      </Card>
    );
  }

  const currentUserId = user?.id || (user as any)?._id;
  const isModerator = community.moderators.includes(currentUserId || "");

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden border-none shadow-xl">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          {community.coverImage && (
            <img
              src={getFullUrl(community.coverImage)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-8 pb-6">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="p-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-white dark:border-gray-800">
                  {community.name.charAt(0)}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {community.name}
                  </h1>
                  {community.isPrivate ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Globe className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    {community.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {community.memberCount}
                    </span>{" "}
                    members
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={isJoined ? "outline" : "primary"}
                onClick={handleJoinLeave}
                className="flex-1 md:flex-none rounded-xl h-11 px-8"
              >
                {isJoined ? "Joined" : "Join Community"}
              </Button>
              {isModerator && (
                <Button
                  variant="ghost"
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 h-11"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
              )}
              <Button
                variant="ghost"
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 h-11"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex border-t border-gray-100 dark:border-gray-800">
          {(["posts", "chat", "members", "about", "manage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              } ${tab === "chat" && !isJoined ? "hidden" : ""} ${tab === "manage" && !isModerator ? "hidden" : ""}`}
            >
              <span className="capitalize">{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {isJoined && <PostCreate onSubmit={handleCreatePost} />}
                {posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <Card className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No posts yet. Be the first to start a conversation!
                    </p>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MemberList communityId={communityId} />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isJoined ? (
                  <CommunityChat
                    communityId={communityId}
                    isAdmin={
                      community?.createdBy?._id === user?._id ||
                      community?.createdBy?._id === user?.id
                    }
                  />
                ) : (
                  <Card className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Join the community to start chatting!
                    </p>
                    <Button onClick={handleJoinLeave} variant="primary">
                      Join Community
                    </Button>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                      About this community
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {community.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Created
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date(community.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Privacy
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {community.isPrivate ? "Private" : "Public"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Moderators
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {/* In a real app we'd fetch actual moderator data */}
                      {community.createdBy && (
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl pr-4">
                          <Avatar
                            src={community.createdBy.avatar}
                            alt={community.createdBy.username}
                            size="sm"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {community.createdBy.username}
                          </span>
                          <Shield className="w-4 h-4 text-primary-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "manage" && isModerator && (
               <motion.div
                 key="manage"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
               >
                 <Card className="p-8 space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-tight">Community Management</h3>
                      <p className="text-sm text-gray-500 font-medium">Strategic controls for your professional community.</p>
                    </div>

                    {/* Edit Form */}
                    <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary-500" />
                        General Settings
                      </h4>
                      <form className="space-y-6" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        try {
                          await communityService.updateCommunity(communityId, {
                            name: formData.get('name') as string,
                            description: formData.get('description') as string,
                          });
                          alert('Community updated successfully!');
                          window.location.reload();
                        } catch (err) {
                          alert('Failed to update community');
                        }
                      }}>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-500">Community Name</label>
                          <input 
                            name="name"
                            defaultValue={community.name}
                            className="w-full bg-white dark:bg-gray-950 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-500">Description</label>
                          <textarea 
                            name="description"
                            defaultValue={community.description}
                            rows={4}
                            className="w-full bg-white dark:bg-gray-950 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <Button type="submit" variant="primary" className="rounded-2xl px-10 h-12 font-black uppercase tracking-widest text-[10px]">
                          Save Changes
                        </Button>
                      </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all cursor-pointer group">
                          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                             <Shield className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Moderation Logs</h4>
                          <p className="text-xs text-gray-500">View recent administrative actions.</p>
                       </div>

                       <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-red-500 transition-all cursor-pointer group">
                          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                             <Users className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Banned Users</h4>
                          <p className="text-xs text-gray-500">Manage community blacklists and appeals.</p>
                       </div>
                    </div>
                 </Card>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
              Rules
            </h3>
            <ul className="space-y-3">
              {[
                "Be professional and respectful",
                "No spam or self-promotion without context",
                "Share valuable insights",
                "Engage with others constructively",
              ].map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="font-bold text-primary-500">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none">
            <h3 className="font-bold text-lg mb-2">Grow your network</h3>
            <p className="text-blue-100 text-sm mb-4">
              Invite your colleagues to join {community.name} and share
              knowledge together.
            </p>
            <Button
              variant="secondary"
              className="w-full bg-white text-primary-600 hover:bg-gray-100"
            >
              Invite Members
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
