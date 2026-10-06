"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Building2, MessageSquare, TrendingUp, Settings, Bell, Megaphone, PlusCircle, Swords, Newspaper, BarChart3, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/components/layout/LanguageProvider';
import communityService, { Community } from '@/services/communityService';
import businessService, { Business } from '@/services/businessService';
import Avatar from '../common/Avatar';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, isRTL } = useLanguage();
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [topBusinesses, setTopBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;
      try {
        const data = await communityService.getUserCommunities(userId);
        setJoinedCommunities(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch user communities:', error);
      }
    };

    const fetchTopBusinesses = async () => {
      try {
        const data = await businessService.getByCategory('All', 1, 3);
        setTopBusinesses(data.businesses || []);
      } catch (error) {
        console.error('Failed to fetch top businesses for sidebar:', error);
      }
    };

    fetchJoinedCommunities();
    fetchTopBusinesses();
    window.addEventListener('community:updated', fetchJoinedCommunities);
    return () => window.removeEventListener('community:updated', fetchJoinedCommunities);
  }, [user]);

  const isBusinessUser = user?.accountType === 'business' || user?.businessId;

  const navItems = [
    { href: '/feed', label: t('nav.feed'), icon: Home },
    { href: '/communities', label: t('nav.communities'), icon: Users },
    { href: '/network', label: t('nav.network') || 'Network', icon: UserCheck },
    { href: '/business', label: t('nav.business'), icon: Building2 },
    ...(isBusinessUser ? [
      { href: '/business/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
      { href: '/promotions', label: t('nav.promotions'), icon: Megaphone }
    ] : []),
    { href: '/trending', label: t('nav.trending'), icon: TrendingUp },
    { href: '/battles', label: t('nav.battles'), icon: Swords },
    { href: '/news', label: t('nav.news'), icon: Newspaper },
    { href: '/messages', label: t('nav.messages'), icon: MessageSquare, badge: 0 },
  ];

  const isMessagesPage = (pathname || '').startsWith('/messages');

  return (
    <aside className={`w-64 z-20 overflow-hidden hidden lg:block shrink-0 ${
      isMessagesPage 
        ? 'h-full border-e border-gray-200/80 dark:border-gray-800/80' 
        : 'h-[calc(100vh-64px)] sticky top-16'
    }`}>
      <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto scrollbar-hide">
      
      {/* Profile Card */}
      {user ? (
        <Link href={`/profile/${user.id || user._id}`}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 group cursor-pointer border border-white/20 dark:border-white/5 shadow-premium"
          >
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar} alt={user.username || 'User'} size="md" className="border-2 border-primary-500/20" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 dark:text-gray-100 truncate text-sm uppercase tracking-tight">{user.username}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate opacity-70">{user.email}</p>
              </div>
            </div>
          </motion.div>
        </Link>
      ) : (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50/50 dark:from-primary-950/40 dark:to-indigo-950/20 border border-primary-200/80 dark:border-primary-800/80 space-y-3">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
            <Building2 className="w-4 h-4 text-primary-600" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('sidebar.guestTitle')}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('sidebar.guestDesc')}
          </p>
          <div className="flex gap-2 pt-1">
            <Link href="/login" className="flex-1 py-1.5 text-center text-xs font-bold rounded-lg border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-100/50 transition-colors">
              {t('nav.signIn')}
            </Link>
            <Link href="/register" className="flex-1 py-1.5 text-center text-xs font-bold rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors">
              {t('sidebar.register')}
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const hasBadge = item.badge !== undefined && item.badge > 0;
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: isRTL ? -4 : 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900/50 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                <span className="text-sm tracking-wide">{item.label}</span>
                
                {hasBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ms-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute end-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Custom Communities Section */}
      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('sidebar.communities')}</h3>
          <Link href="/communities">
            <PlusCircle className="w-4 h-4 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
          </Link>
        </div>
        
        <div className="space-y-1">
          <AnimatePresence>
            {joinedCommunities.map((community, index) => (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={community._id}
              >
                <Link
                  href={`/communities/${community._id}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-medium group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-[10px] group-hover:rotate-12 transition-transform">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate flex-1">{community.name}</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {joinedCommunities.length === 0 && (
            <p className="px-4 text-[10px] text-gray-400 italic">{t('sidebar.noCommunities')}</p>
          )}
        </div>
      </div>

      {/* Top Businesses Section */}
      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {t('business.topBusinesses') || 'Top Businesses'}
          </h3>
          <Link href="/business">
            <Building2 className="w-4 h-4 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
          </Link>
        </div>
        
        <div className="space-y-1">
          {topBusinesses.map((biz) => (
            <Link
              key={biz._id}
              href={`/business/${biz._id}`}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-medium group"
            >
              <Avatar src={biz.logo || biz.avatarUrl} alt={biz.name} size="sm" className="w-7 h-7 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600">
                  {biz.name}
                </p>
                <p className="truncate text-[10px] text-gray-400">
                  {biz.category || biz.industry}
                </p>
              </div>
            </Link>
          ))}
          {topBusinesses.length === 0 && (
            <p className="px-4 text-[10px] text-gray-400 italic">
              {t('business.browseBusinesses') || 'Explore companies'}
            </p>
          )}
        </div>
      </div>

      {/* Quick Settings */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
        <Link href="/settings">
          <motion.div 
            whileHover={{ x: isRTL ? -4 : 4 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              pathname === '/settings'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">{t('nav.settings')}</span>
          </motion.div>
        </Link>
      </div>
    </div>
  </aside>
  );
};

export default Sidebar;
