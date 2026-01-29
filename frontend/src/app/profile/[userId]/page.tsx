"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Link as LinkIcon, Calendar, MessageCircle } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import PostList from "@/components/post/PostList";
import Spinner from "@/components/common/Spinner";
import userService, { User } from "@/services/userService";
import postService from "@/services/postService";
import messageService from "@/services/messageService";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const userId =
    (params?.userId as string) || currentUser?.id || currentUser?._id;

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
      loadPosts(userId);
    }
  }, [userId]);

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
              <div className="flex items-start justify-between mb-4">
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
                      ? "Business Account"
                      : "Personal Account"}
                  </Badge>
                </div>

                {!isOwnProfile && currentUser && (
                  <div className="flex gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleMessage}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Button>
                  </div>
                )}

                {isOwnProfile && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/settings")}
                  >
                    Edit Profile
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
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {user.followers.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    Followers
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {user.following.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    Following
                  </span>
                </div>
              </div>

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
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Posts
        </h2>
        <PostList posts={posts} isLoading={isLoadingPosts} />
      </div>
    </div>
  );
}
