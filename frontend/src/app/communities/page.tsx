"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Users, Shield, Sparkles, BookOpen, Compass, CheckCircle } from "lucide-react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import CommunityList from "@/components/community/CommunityList";
import CommunityCreateModal from "@/components/community/CommunityCreateModal";
import communityService, { Community } from "@/services/communityService";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function CommunitiesPage() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"explore" | "sidebar">("explore");
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);

  const categories = [
    "All",
    "Technology",
    "Business",
    "Marketing",
    "Design",
    "Finance",
    "Healthcare",
    "Education",
    "Entertainment",
  ];

  useEffect(() => {
    const fetchJoined = async () => {
      const userId = user?.id || user?._id;
      if (!userId) {
        setJoinedCommunities([]);
        return;
      }
      try {
        const data = await communityService.getUserCommunities(userId);
        setJoinedCommunities(data);
      } catch (err) {
        console.error("Failed to load user communities:", err);
      }
    };
    fetchJoined();
    window.addEventListener("community:updated", fetchJoined);
    return () => window.removeEventListener("community:updated", fetchJoined);
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1">
              {t("communities.title", "Communities")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t("communities.subtitle", "Discover and join communities around your interests")}
            </p>
          </div>
          <Button
            variant="primary"
            className="flex items-center justify-center gap-2 px-5 py-2.5 h-10 sm:h-11 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 whitespace-nowrap w-full sm:w-auto shrink-0 transition-transform active:scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 shrink-0 text-white" />
            <span className="text-white font-bold">
              {t("communities.create", isRTL ? "إنشاء مجتمع" : "Create Community")}
            </span>
          </Button>
        </div>

        <CommunityCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />

        {/* Mobile View Switcher (lg:hidden) */}
        <div className="flex lg:hidden items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setMobileTab("explore")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mobileTab === "explore"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Compass className="w-4 h-4 text-primary-500" />
            <span>{isRTL ? "استكشاف المجتمعات" : "Explore Communities"}</span>
          </button>
          <button
            onClick={() => setMobileTab("sidebar")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mobileTab === "sidebar"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-500" />
            <span>
              {isRTL ? "مجتمعاتي والإرشادات" : "My Hub & Guidelines"}
              {joinedCommunities.length > 0 && ` (${joinedCommunities.length})`}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Explore & Communities List */}
        <div className={`space-y-6 ${mobileTab === "sidebar" ? "hidden lg:block" : "block"} lg:col-span-8`}>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute start-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder={t("communities.search", "Search communities...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-11 w-full rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category === "All" ? "" : category)
                }
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  (category === "All" && !selectedCategory) ||
                  category === selectedCategory
                    ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/25"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-primary-500/50"
                }`}
              >
                {t(`categories.${category}`, category)}
              </button>
            ))}
          </div>

          {/* Communities List */}
          <div className="space-y-6">
            <CommunityList searchQuery={searchQuery} category={selectedCategory} />
          </div>
        </div>

        {/* Right Sidebar Column */}
        <aside className={`space-y-6 ${mobileTab === "explore" ? "hidden lg:block" : "block"} lg:col-span-4`}>
          {/* Joined Communities Card */}
          <Card className="p-5 border-none shadow-xl bg-white dark:bg-gray-950 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
                  {isRTL ? "مجتمعاتي المنضم إليها" : "My Joined Communities"}
                </h3>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                {joinedCommunities.length}
              </span>
            </div>

            <div className="space-y-2">
              {joinedCommunities.length > 0 ? (
                joinedCommunities.map((c) => (
                  <Link
                    key={c._id}
                    href={`/communities/${c._id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 font-bold flex items-center justify-center text-xs shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {c.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 tabular-nums shrink-0">
                      {c.memberCount || 1} {t("communities.members", "members")}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 font-medium">
                    {isRTL
                      ? "لم تنضم لأي مجتمع بعد. استكشف وانضم الآن!"
                      : "No communities joined yet. Explore and join one!"}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Professional Guidelines & Hub Card */}
          <Card className="p-5 border-none shadow-xl bg-white dark:bg-gray-950 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
                {isRTL ? "ميثاق المجتمع المهني" : "Community Rules"}
              </h3>
            </div>

            <ul className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i}
                  </span>
                  <span>{t(`communities.rule${i}`)}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Grow Your Network Banner */}
          <Card className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none rounded-2xl shadow-xl shadow-primary-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="font-black text-sm uppercase tracking-wider">
                {t("communities.growNetwork", "Grow your network")}
              </h3>
            </div>
            <p className="text-primary-100 text-xs mb-4 leading-relaxed">
              {t(
                "communities.growNetworkDesc",
                "Invite your colleagues to join and share knowledge together.",
              )}
            </p>
            <Button
              variant="secondary"
              className="w-full bg-white text-primary-600 hover:bg-gray-100 h-9 rounded-xl font-bold text-xs"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert(isRTL ? "تم نسخ الرابط!" : "Community link copied!");
                }
              }}
            >
              {t("communities.inviteMembers", "Invite Members")}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
