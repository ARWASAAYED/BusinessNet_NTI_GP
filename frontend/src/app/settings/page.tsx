"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AccountSettings from '@/components/settings/AccountSettings';
import { useAuth } from '@/hooks/useAuth';
import userService, { User as UserType } from '@/services/userService';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'account';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user: authUser, isLoading: authLoading, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = useMemo(() => [
    { id: 'profile', label: 'Edit Profile', icon: User, description: 'Manage your public information and how others see you.' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Control how and when you receive updates.' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Manage your account protection and login activity.' },
    { id: 'account', label: 'Account', icon: Settings, description: 'Manage your account status and general preferences.' },
  ], []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getCurrentUser();
        if (!data) throw new Error('Could not fetch user profile');
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile settings');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && authUser) {
      loadProfile();
    }
  }, [isAuthenticated, authUser]);

  const handleUpdateSuccess = (updatedUser: UserType) => {
    setUserProfile(updatedUser);
  };

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="hidden md:block pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-8 text-center border-red-200 bg-red-50/50">
                  <p className="text-red-600 font-medium mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Reload Page</Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Dynamic Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tabs.find(t => t.id === activeTab)?.description}
                  </p>
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && userProfile && (
                  <ProfileEditForm 
                    user={userProfile} 
                    onSuccess={handleUpdateSuccess}
                  />
                )}

                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'account' && <AccountSettings />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}