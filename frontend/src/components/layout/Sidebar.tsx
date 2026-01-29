"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Building2, MessageSquare, TrendingUp, Settings, Bell, Megaphone, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import communityService, { Community } from '@/services/communityService';
import Avatar from '../common/Avatar';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      if (!user) return;
      try {
        const data = await communityService.getUserCommunities(user.id || user._id);
        setJoinedCommunities(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch user communities:', error);
      }
    };

    fetchJoinedCommunities();
    window.addEventListener('community:updated', fetchJoinedCommunities);
    return () => window.removeEventListener('community:updated', fetchJoinedCommunities);
  }, [user]);

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    ...(user?.accountType === 'business' || user?.businessId ? [{ href: '/business/dashboard', label: 'Dashboard', icon: TrendingUp }] : []),
    { href: '/communities', label: 'Communities', icon: Users },
    { href: '/business', label: 'Business', icon: Building2 },
    { href: '/promotions', label: 'Promotions', icon: Megaphone },
    {href:'/trending',label:'Trending',icon:TrendingUp},
    { href: '/messages', label: 'Messages', icon: MessageSquare, badge: 0 },
    { href: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },

  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] sticky top-16 z-20 overflow-hidden hidden lg:block">
      <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto scrollbar-hide">
        
        {/* Profile Card */}
        {user && (
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
                  whileHover={{ x: 4 }}
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
                      className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
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
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Communities</h3>
            <Link href="/communities">
              <PlusCircle className="w-4 h-4 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
            </Link>
          </div>
          
          <div className="space-y-1">
            <AnimatePresence>
              {joinedCommunities.map((community, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
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
              <p className="px-4 text-[10px] text-gray-400 italic">No communities yet</p>
            )}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
          <Link href="/settings">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              pathname === '/settings'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
            }`}>
              <Settings className="w-5 h-5" />
              <span className="text-sm">Account Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
