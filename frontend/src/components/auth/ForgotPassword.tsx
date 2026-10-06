"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function ForgotPassword() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.validEmail'));
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError(t('auth.resetFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl shadow-black/40">
          <div className="flex justify-center mb-5">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{t('auth.checkEmail')}</h2>
          <p className="text-gray-400 mb-5 text-sm font-medium">
            {t('auth.resetSent', { email })}
          </p>
          <p className="text-xs text-gray-500 mb-6">
            {t('auth.didntReceive')}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 font-bold text-sm transition-all"
            >
              {t('auth.tryAnother')}
            </button>
            <Link href="/login">
              <button className="w-full py-3 rounded-xl text-gray-500 hover:text-gray-300 font-bold text-sm transition-all flex items-center justify-center gap-2">
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {t('auth.backToLogin')}
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
              <Mail className="w-8 h-8 text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1.5 tracking-tight">{t('auth.forgotTitle')}</h1>
          <p className="text-gray-400 text-sm font-medium">
            {t('auth.forgotSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.email')}
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              dir="ltr"
              className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
            />
            {error && (
              <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                {error}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!email || isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-xl shadow-primary-500/20 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('auth.sendReset')
            )}
          </motion.button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-500 hover:text-gray-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>
      </div>

      <p className="text-center text-sm text-gray-600 mt-5">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
          {t('auth.createFree')}
        </Link>
      </p>
    </motion.div>
  );
}
