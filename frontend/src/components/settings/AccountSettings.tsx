"use client";

import React, { useState } from 'react';
import { Settings, Trash2, Eye, UserX } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function AccountSettings() {
  const { locale, setLocale, t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');

  const privacyItems = [
    { key: 'publicProfile', label: t('settings.account.publicProfile'), desc: t('settings.account.publicProfileDesc'), default: true },
    { key: 'showActivities', label: t('settings.account.showActivities'), desc: t('settings.account.showActivitiesDesc'), default: true },
    { key: 'readReceipts', label: t('settings.account.readReceipts'), desc: t('settings.account.readReceiptsDesc'), default: false },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('settings.account.generalTitle')}
        </h3>
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.account.accountEmail')}
            </label>
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <Button variant="outline">{t('settings.account.updateEmail')}</Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.language')}
            </label>
            <select
              value={locale}
              onChange={e => setLocale(e.target.value as 'en' | 'ar')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-gray-100"
            >
              <option value="en">🇬🇧 English (US)</option>
              <option value="ar">🇸🇦 العربية (Arabic)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Eye className="w-5 h-5 text-gray-400" />
          {t('settings.account.privacyTitle')}
        </h3>
        <div className="space-y-5">
          {privacyItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-4 ring-transparent dark:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8 border-red-100 dark:border-red-900/30 bg-red-50/20 dark:bg-red-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <UserX className="w-6 h-6" />
              {t('settings.account.dangerZone')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg">
              {t('settings.account.dangerDesc')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/30">
              {t('settings.account.deactivate')}
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('settings.account.deleteAccount')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
