"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Link from 'next/link';

export default function ForgotPassword() {
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
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would call: await authService.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-full">
                <CheckCircle className="w-12 h-12 text-success-600 dark:text-success-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Check your email
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
              
              <Link href="/login">
                <Button variant="ghost" fullWidth>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </div>
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
                <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Forgot your password?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                icon={<Mail className="w-5 h-5" />}
              />
              {error && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!email}
            >
              Send reset instructions
            </Button>

            <div className="text-center">
              <Link 
                href="/login"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
