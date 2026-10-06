"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Building2, MessageSquare, Bell, Search, LogOut, User, Settings, TrendingUp, Megaphone, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import NotificationBell from '../notification/NotificationBell';
import NotificationList from '../notification/NotificationList';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from './LanguageProvider';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  if (pathname === '/login' || pathname === '/register') return null;
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, isRTL } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userMenuItems = [
    {
      label: t('nav.profile'),
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
      label: t('nav.settings'),
      onClick: () => router.push('/settings'),
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: t('nav.logout'),
      onClick: logout,
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
    },
  ];

  if (!mounted || !isAuthenticated) {
    return (
      <nav className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shadow-md shadow-primary-500/30">
                <span className="text-white font-black text-xl">{t('app.letter')}</span>
              </div>
              <span className="text-xl font-black gradient-text">{t('app.name')}</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/feed"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Compass className="w-4 h-4 text-primary-500" />
                <span>{t('nav.feed')}</span>
              </Link>
              <LanguageToggle />
              <ThemeToggle />
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-smooth"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-bold gradient-bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/40 transition-smooth"
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: isRTL ? -10 : 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-primary-500/30"
            >
              <span className="text-white font-black text-2xl tracking-tighter">{t('app.letter')}</span>
            </motion.div>
            <span className="text-2xl font-black gradient-text hidden sm:block">{t('app.name')}</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('nav.search')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    }
                  }
                }}
                className="w-full ps-10 pe-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/30 transition-smooth bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Theme Toggle & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Toggle */}
            <LanguageToggle />

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
                      className="fixed sm:absolute end-4 sm:end-0 top-16 sm:top-full mt-2 z-50"
                    >
                      <NotificationList onClose={() => setShowNotifications(false)} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <Dropdown
              align="end"
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
