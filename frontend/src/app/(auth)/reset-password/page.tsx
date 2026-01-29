"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production: await authService.resetPassword(token, password);
      setIsSubmitted(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-full">
                <CheckCircle className="w-12 h-12 text-success-600 dark:text-success-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Password reset successful!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
            
            <Link href="/login">
              <Button fullWidth>
                Go to Login
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Reset your password
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
              <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!password || !confirmPassword || !token}
            >
              Reset Password
            </Button>

            <div className="text-center">
              <Link 
                href="/login"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
