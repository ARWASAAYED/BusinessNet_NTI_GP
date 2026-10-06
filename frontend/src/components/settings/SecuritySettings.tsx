"use client";

import React, { useState } from 'react';
import { Shield, Key, Smartphone, History, Check } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function SecuritySettings() {
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setSuccessMsg(t('common.save') + ' ✓');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('settings.security.changePassword')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.security.changePasswordDesc')}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.security.currentPassword')}
            </label>
            <Input 
              type="password" 
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.security.newPassword')}
            </label>
            <Input 
              type="password" 
              value={passwords.new}
              onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.security.confirmPassword')}
            </label>
            <Input 
              type="password" 
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" isLoading={isLoading} className="w-full h-12 rounded-xl font-bold">
              {t('settings.security.updatePassword')}
            </Button>
          </div>
          {successMsg && (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> {successMsg}
            </p>
          )}
        </form>
      </Card>

      <Card className="p-8 border-none bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-900">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t('settings.security.twoFactor')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.security.twoFactorDesc')}
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0 font-bold">
            {t('settings.security.enable2fa')}
          </Button>
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t('settings.security.loginSessions')}
          </h3>
        </div>
        <div className="space-y-4">
          {[
            { device: 'Chromium on Windows', location: 'Riyadh, KSA', time: t('settings.security.activeNow'), isCurrent: true },
            { device: 'Safari on iPhone', location: 'Cairo, Egypt', time: '2 days ago', isCurrent: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{session.device}</p>
                    {session.isCurrent && <Badge variant="success" size="sm">{t('settings.security.currentSession')}</Badge>}
                  </div>
                  <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                </div>
              </div>
              {!session.isCurrent && (
                <button type="button" className="text-sm text-red-600 font-medium hover:underline">
                  {t('settings.security.revoke')}
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
