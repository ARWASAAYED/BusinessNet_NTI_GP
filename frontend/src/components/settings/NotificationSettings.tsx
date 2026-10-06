"use client";

import React, { useState } from 'react';
import { Mail, Smartphone, AtSign, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function NotificationSettings() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState({
    email: {
      likes: true,
      comments: true,
      mentions: true,
      follows: true,
    },
    push: {
      likes: true,
      comments: true,
      mentions: true,
      follows: true,
      messages: true,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggle = (type: 'email' | 'push', key: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !((prev[type] as any)[key])
      }
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const items = [
    { key: 'likes', label: t('settings.notifications.likes'), desc: t('settings.notifications.likesDesc'), icon: Heart },
    { key: 'comments', label: t('settings.notifications.comments'), desc: t('settings.notifications.commentsDesc'), icon: MessageCircle },
    { key: 'mentions', label: t('settings.notifications.mentions'), desc: t('settings.notifications.mentionsDesc'), icon: AtSign },
    { key: 'follows', label: t('settings.notifications.follows'), desc: t('settings.notifications.followsDesc'), icon: UserPlus },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('settings.notifications.interactionsTitle')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('settings.notifications.interactionsDesc')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end gap-12 text-xs font-bold uppercase tracking-wider text-gray-400 px-4">
            <span className="w-12 text-center">{t('settings.notifications.push')}</span>
            <span className="w-12 text-center">{t('settings.notifications.email')}</span>
          </div>

          {items.map((item) => {
            const Icon = item.icon;
            const pushActive = preferences.push[item.key as keyof typeof preferences.push];
            const emailActive = preferences.email[item.key as keyof typeof preferences.email];

            return (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <div className="flex gap-12">
                  <button 
                    type="button"
                    onClick={() => toggle('push', item.key)}
                    className={`w-12 flex justify-center p-2.5 rounded-xl transition-all ${
                      pushActive 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 font-bold scale-105' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => toggle('email', item.key)}
                    className={`w-12 flex justify-center p-2.5 rounded-xl transition-all ${
                      emailActive 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 font-bold scale-105' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end items-center gap-3">
        {isSaved && (
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> {t('common.save')} ✓
          </span>
        )}
        <Button onClick={handleSave} isLoading={isLoading} className="px-8 rounded-xl h-12 shadow-lg shadow-primary-500/20 font-bold">
          {t('settings.notifications.savePreferences')}
        </Button>
      </div>
    </div>
  );
}
