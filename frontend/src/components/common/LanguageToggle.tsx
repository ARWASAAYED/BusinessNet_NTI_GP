"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/components/layout/LanguageProvider';

const LanguageToggle = () => {
  const { locale, setLocale, isRTL } = useLanguage();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleLocale}
      className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group"
      title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
      >
        {locale === 'en' ? 'عربي' : 'EN'}
      </motion.span>

      {/* Glow indicator */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:via-secondary-500/10 group-hover:to-primary-500/10 transition-all duration-500 -z-10" />
    </motion.button>
  );
};

export default LanguageToggle;
