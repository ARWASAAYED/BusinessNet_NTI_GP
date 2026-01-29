import React, { useEffect, useState } from "react";
import BusinessEditForm from "./BusinessEditForm";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Users,
  CheckCircle,
  Calendar,
  Share2,
  MoreHorizontal,
  Plus,
  ShoppingBag,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import businessService, { Business } from "@/services/businessService";
import postService, { Post } from "@/services/postService";
import { useAuth } from "@/hooks/useAuth";
import Card from "../common/Card";
import MessageButton from "../common/MessageButton";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Spinner from "../common/Spinner";
import PostCard from "../post/PostCard";
import ReputationBadge from "./ReputationBadge";
import BusinessHealthCard from "./BusinessHealthCard";

interface BusinessProfileProps {
  businessId: string;
}

export default function BusinessProfile({ businessId }: BusinessProfileProps) {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddOffering, setShowAddOffering] = useState(false);
  const [newOffering, setNewOffering] = useState({
    name: "",
    description: "",
    price: "",
  });

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

  const handleAddOffering = async () => {
    if (!business || !newOffering.name) return;
    try {
      const updatedBusiness = await businessService.addOffering(businessId, {
        ...newOffering,
        price: parseFloat(newOffering.price) || 0,
      });
      setBusiness(updatedBusiness);
      setNewOffering({ name: "", description: "", price: "" });
      setShowAddOffering(false);
    } catch (error) {
      console.error("Failed to add offering:", error);
    }
  };

  const handleRemoveOffering = async (offeringId: string) => {
    if (!business) return;
    try {
      const updatedBusiness = await businessService.removeOffering(
        businessId,
        offeringId
      );
      setBusiness(updatedBusiness);
    } catch (error) {
      console.error("Failed to remove offering:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
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
      {/* Header Card */}
      <Card className="overflow-hidden border-none shadow-premium rounded-[2rem] bg-white dark:bg-gray-950">
        <div className="h-64 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-transparent to-indigo-900/60 z-10" />
          <div className="absolute inset-0 bg-mesh opacity-50 z-0" />
          {business.coverImage && (
            <img
              src={getFullUrl(business.coverImage)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-10 pb-10">
          <div className="relative flex justify-between items-end -mt-20 mb-8 z-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-1 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl"
            >
              <Avatar
                src={business.logo}
                alt={business.name}
                className="w-40 h-40 rounded-[2.2rem] object-cover border-4 border-white dark:border-gray-900"
              />
            </motion.div>

            <div className="flex gap-4 mb-4">
              {business.userId !== currentUserId && (
                <MessageButton
                  userId={business.userId}
                  variant="icon"
                  size="md"
                />
              )}
              {isOwner ? (
                 <Button
                  variant="secondary"
                  onClick={() => setShowEditProfile(true)}
                  className="rounded-2xl px-10 h-14 font-black tracking-wide text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  EDIT PROFILE
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "primary"}
                  onClick={handleFollow}
                  className="rounded-2xl px-10 h-14 font-black tracking-wide text-sm"
                >
                  {isFollowing ? "FOLLOWING" : "FOLLOW BUSINESS"}
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-14 h-14 rounded-2xl glass-effect p-0"
              >
                <Share2 className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                className="w-14 h-14 rounded-2xl glass-effect p-0"
              >
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  {business.name}
                </h1>
                {business.verified && (
                  <div className="p-1 bg-primary-500 rounded-full">
                    <CheckCircle className="w-5 h-5 text-white fill-current" />
                  </div>
                )}
              </div>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {business.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {business.category && (
                  <Badge variant="primary" size="md">
                    {business.category}
                  </Badge>
                )}
                {business.hashtags && business.hashtags.map((tag: any) => (
                  <Badge key={tag._id || tag} variant="secondary" size="md" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
                    #{tag.name}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 pt-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
                {business.address?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>
                      {business.address.city}, {business.address.country}
                    </span>
                  </div>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Est {new Date(business.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4 min-w-[240px] border-primary-500/10">
              <ReputationBadge score={business.reputationScore} size="md" />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
                    {business.followers.length}
                  </span>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Followers
                  </span>
                </div>
                <Users className="w-8 h-8 text-primary-500/20" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Business Details & Offerings */}
        <div className="lg:col-span-4 space-y-8">
          {/* Business Health & AI Audit */}
          <BusinessHealthCard businessId={businessId} />

          {/* Offerings Section */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary-500" />
                Offerings
              </h3>
              {isOwner && (
                <button
                  onClick={() => setShowAddOffering(!showAddOffering)}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg shadow-primary-500/30"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {showAddOffering && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-primary-500/30 mb-4 space-y-4">
                      <input
                        type="text"
                        placeholder="Offering Name"
                        className="w-full bg-white dark:bg-gray-950 border-none rounded-xl p-3 text-sm focus:ring-2 ring-primary-500"
                        value={newOffering.name}
                        onChange={(e) =>
                          setNewOffering({
                            ...newOffering,
                            name: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Description"
                        className="w-full bg-white dark:bg-gray-950 border-none rounded-xl p-3 text-sm focus:ring-2 ring-primary-500 resize-none"
                        rows={2}
                        value={newOffering.description}
                        onChange={(e) =>
                          setNewOffering({
                            ...newOffering,
                            description: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Price (optional)"
                        className="w-full bg-white dark:bg-gray-950 border-none rounded-xl p-3 text-sm focus:ring-2 ring-primary-500"
                        value={newOffering.price}
                        onChange={(e) =>
                          setNewOffering({
                            ...newOffering,
                            price: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 rounded-xl"
                          onClick={handleAddOffering}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-xl"
                          onClick={() => setShowAddOffering(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {business.offerings && business.offerings.length > 0 ? (
                business.offerings.map((offering) => (
                  <motion.div
                    layout
                    key={offering._id}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 group relative hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {offering.name}
                      </h4>
                      {offering.price && (
                        <span className="text-primary-600 font-black text-sm">
                          ${offering.price}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {offering.description}
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveOffering(offering._id)}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 grayscale">
                    No offerings listed yet.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Followers Section */}
          <Card className="p-8 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-500" />
                Followers ({business.followers.length})
              </h3>
            </div>

            {business.followers && business.followers.length > 0 ? (
              <div className="space-y-3">
                {business.followers.slice(0, 10).map((followerId, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                      {String(index + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Follower #{index + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {String(followerId).slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                ))}
                {business.followers.length > 10 && (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    +{business.followers.length - 10} more followers
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No followers yet. Be the first to follow!
                </p>
              </div>
            )}
          </Card>

          {/* About Section */}
          <Card className="p-8 rounded-[2rem]">
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-widest">
              About Section
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                    Email Inquiry
                  </p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {business.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                    Direct Dial
                  </p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {business.phone}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Posts Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Timeline ({posts.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="primary" className="rounded-xl px-4 py-2">
                ALL POSTS ({posts.length})
              </Badge>
              <Badge variant="gray" className="rounded-xl px-4 py-2 opacity-50">
                MEDIA
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <Card className="p-20 text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Building2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No updates yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  This business hasn't shared any posts yet. Follow them to be
                  the first to see new updates.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showEditProfile && business && (
          <BusinessEditForm 
            business={business} 
            onClose={() => setShowEditProfile(false)}
            onSuccess={(updated) => {
              setBusiness(updated);
             // Optionally refresh health/other data here
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
