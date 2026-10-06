"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/layout/LanguageProvider';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 mb-5 shadow-xl shadow-primary-500/30"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-1.5 tracking-tight">{t('auth.loginTitle')}</h1>
          <p className="text-gray-400 text-sm font-medium">{t('auth.loginSubtitle', { name: t('app.name') })}</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.email')}
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-xl shadow-primary-500/20 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {t('auth.login')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-600 text-xs font-bold uppercase tracking-widest">{t('auth.orContinue')}</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500">
            {t('auth.noAccount')}{' '}
            <Link
              href="/register"
              className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t('auth.createFree')}
            </Link>
          </p>

        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
