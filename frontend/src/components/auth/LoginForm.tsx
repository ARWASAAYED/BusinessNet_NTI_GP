"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '@/hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setIsLoading(false);
    }
    // Redirection is handled in useAuth hook
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-effect rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-bg-primary mb-4 glow-effect"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-gray-600">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-500" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-500" />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full gradient-bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500 rounded-full">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              Create one for free
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
