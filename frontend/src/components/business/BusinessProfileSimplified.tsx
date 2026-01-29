"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  Calendar,
  Share2,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import businessService, { Business } from "@/services/businessService";
import postService, { Post } from "@/services/postService";
import { useAuth } from "@/hooks/useAuth";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Spinner from "../common/Spinner";
import PostCard from "../post/PostCard";
import MessageButton from "../common/MessageButton";

interface BusinessProfileSimplifiedProps {
  businessId: string;
}

export default function BusinessProfileSimplified({
  businessId,
}: BusinessProfileSimplifiedProps) {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const getFullUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  const currentUserId = user?.id || (user as any)?._id;
  const isOwner = business?.userId === currentUserId;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bizData, postsData] = await Promise.all([
          businessService.getBusiness(businessId),
          postService.getBusinessPosts(businessId),
        ]);
        setBusiness(bizData);
        setPosts(postsData.posts || []);

        if (currentUserId && bizData.followers.includes(currentUserId)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("Failed to load business profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (businessId) loadData();
  }, [businessId, currentUserId]);

  const handleFollow = async () => {
    if (!business) return;
    try {
      if (isFollowing) {
        await businessService.unfollowBusiness(businessId);
        setIsFollowing(false);
      } else {
        await businessService.followBusiness(businessId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <Card className="p-10 text-center">
        <p className="text-gray-500">Business not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Header Card */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div className="h-40 bg-gradient-to-r from-primary-500 to-secondary-500 relative overflow-hidden">
          {business.coverImage && (
            <img
              src={getFullUrl(business.coverImage)}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative -mt-20"
            >
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 p-1 shadow-lg">
                <Avatar
                  src={business.logo}
                  alt={business.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              {business.verified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5">
                  <CheckCircle className="w-4 h-4 fill-current" />
                </div>
              )}
            </motion.div>

            {/* Info and Actions */}
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {business.name}
                </h1>
                {business.category && (
                  <Badge variant="primary" size="sm" className="mb-2">
                    {business.category}
                  </Badge>
                )}
                {business.address?.city && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {business.address.city}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {business.userId !== currentUserId && (
                  <>
                    <MessageButton
                      userId={business.userId}
                      variant="icon"
                      size="md"
                    />
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {business.followers.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Followers
              </p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                {posts.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Posts
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-primary-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Est {new Date(business.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          {/* Description */}
          {business.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-4">
              {business.description}
            </p>
          )}
        </div>
      </Card>

      {/* Posts Timeline */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Posts
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed">
            <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 dark:text-gray-400 font-medium mb-1">
              No posts yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Follow to see updates when they share new posts
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
