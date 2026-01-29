"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Building2, MessageSquare, Bell, Search, LogOut, User, Settings, TrendingUp, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import NotificationBell from '../notification/NotificationBell';
import NotificationList from '../notification/NotificationList';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userMenuItems = [
    {
      label: 'Profile',
      onClick: () => {
        const userId = user?.id || user?._id;
        if (userId) {
          router.push(`/profile/${userId}`);
        } else {
          console.warn('Navbar: Cannot navigate to profile, userId missing');
        }
      },
      icon: <User className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      onClick: () => router.push('/settings'),
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: 'Logout',
      onClick: logout,
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
    },
  ];

  if (!mounted || !isAuthenticated) {
    return (
      <nav className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold gradient-text">BusinessNet</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-smooth"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 gradient-bg-primary text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-smooth"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-primary-500/30"
            >
              <span className="text-white font-black text-2xl tracking-tighter">B</span>
            </motion.div>
            <span className="text-2xl font-black gradient-text hidden sm:block">BusinessNet</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    }
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/30 transition-smooth bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Theme Toggle & Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <NotificationBell
                count={unreadCount}
                onClick={() => setShowNotifications(!showNotifications)}
              />
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 z-50"
                    >
                      <NotificationList onClose={() => setShowNotifications(false)} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <Dropdown
              trigger={
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar src={user?.avatar} alt={user?.username || 'User'} size="sm" />
                  <span className="font-medium text-gray-700 dark:text-gray-300 hidden lg:block">{user?.username}</span>
                </div>
              }
              items={userMenuItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
