"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Building2, 
  MessageSquare, 
  Bell, 
  TrendingUp, 
  Megaphone, 
  Swords, 
  Newspaper, 
  BarChart3,
  Menu,
  X,
  Settings,
  ChevronRight,
  ShieldCheck,
  Compass,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/components/layout/LanguageProvider';
import Avatar from '../common/Avatar';

const MobileNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBusinessUser = user?.accountType === 'business' || Boolean(user?.businessId);

  // Bottom 5 primary items
  const primaryNav = [
    { href: '/feed', label: t('nav.feed'), icon: Home },
    { href: '/communities', label: t('nav.communities'), icon: Users },
    { 
      href: isBusinessUser ? '/business/dashboard' : '/business', 
      label: isBusinessUser ? t('nav.dashboard') : t('nav.business'), 
      icon: isBusinessUser ? BarChart3 : Building2 
    },
    { href: '/messages', label: t('nav.messages'), icon: MessageSquare, badge: 0 },
  ];

  // Secondary items in the "More / المزيد" bottom sheet
  const moreItems = [
    { href: '/network', label: t('nav.network') || 'Network', desc: isRTL ? 'متابعون ومتابَعون واقتراحات' : 'Followers, following & suggestions', icon: UserCheck, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
    { href: '/business', label: t('nav.business'), desc: t('business.browseBusinesses') || 'Explore companies & services', icon: Building2, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { href: '/business/dashboard', label: t('nav.dashboard'), desc: t('dashboard.title') || 'Analytics, leads & growth', icon: BarChart3, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
    { href: '/promotions', label: t('nav.promotions'), desc: t('promotions.title') || 'Campaigns, boosts & ads', icon: Megaphone, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { href: '/battles', label: t('nav.battles'), desc: t('battles.title') || 'Head-to-head challenges', icon: Swords, color: 'text-red-500 bg-red-50 dark:bg-red-950/40' },
    { href: '/trending', label: t('nav.trending'), desc: t('nav.trending') || 'Viral topics & ideas', icon: TrendingUp, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { href: '/news', label: t('nav.news'), desc: t('nav.news') || 'Market updates & reports', icon: Newspaper, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { href: '/notifications', label: t('nav.notifications'), desc: t('nav.notifications') || 'Activity & alerts', icon: Bell, badge: unreadCount, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40' },
    { href: '/settings', label: t('nav.settings'), desc: t('settings.title') || 'Preferences & privacy', icon: Settings, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  ];

  // Skip rendering on pages that have their own mobile nav or are auth pages
  const hiddenPaths = ['/login', '/register', '/forgot-password'];
  if (hiddenPaths.some(p => pathname?.startsWith(p))) return null;

  return (
    <>
      {/* Mobile Drawer / Bottom Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute bottom-0 inset-x-0 bg-white dark:bg-gray-950 rounded-t-[2rem] border-t border-gray-200 dark:border-gray-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto absolute top-2 inset-x-0 w-12" />
                  <span className="font-black text-gray-900 dark:text-gray-100 text-lg">
                    {t('nav.more') || (isRTL ? 'المزيد والتنقل' : 'Explore & More')}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User quick profile if logged in */}
              {user && (
                <div className="p-4 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-b border-gray-100 dark:border-gray-800">
                  <Link 
                    href={`/profile/${user.id || user._id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <Avatar src={user.avatar} alt={user.username} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{user.username}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold truncate capitalize">
                        {user.accountType === 'business' ? (t('business.account') || 'Business Account') : (t('nav.profile') || 'View Profile')}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              )}

              {/* Items List */}
              <div className="overflow-y-auto p-4 space-y-2 flex-1 pb-10">
                {/* Business Highlights Box if Business User */}
                {isBusinessUser && (
                  <div className="mb-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-primary-50 dark:from-indigo-950/30 dark:to-primary-950/20 border border-primary-200 dark:border-primary-800/60">
                    <p className="text-[10px] font-black uppercase tracking-wider text-primary-700 dark:text-primary-300 mb-2">
                      {isRTL ? 'أدوات الأعمال السريعة' : 'Quick Business Tools'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/business/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                      >
                        <BarChart3 className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{t('nav.dashboard')}</span>
                      </Link>
                      <Link
                        href="/promotions"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                      >
                        <Megaphone className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{t('nav.promotions')}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</p>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 start-0 end-0 z-40 lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 pb-safe pt-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const hasBadge = item.badge !== undefined && item.badge > 0;

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 font-bold'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 -m-1.5 bg-primary-500/10 dark:bg-primary-400/10 rounded-xl"
                      />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-all ${isActive ? 'scale-110' : ''}`} />
                    {hasBadge && (
                      <span className="absolute -top-1.5 -end-1.5 bg-red-500 text-white text-[9px] font-black px-1 py-px rounded-full min-w-[16px] text-center leading-tight z-20">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-wide transition-all ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative ${
                isMenuOpen || ['/promotions', '/trending', '/news', '/settings', '/battles', '/network', '/notifications'].some(p => pathname?.startsWith(p))
                  ? 'text-primary-600 dark:text-primary-400 font-bold'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Menu className="w-5 h-5 relative z-10" />
              <span className="text-[10px] mt-0.5 tracking-wide opacity-70">
                {isRTL ? 'المزيد' : 'More'}
              </span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
