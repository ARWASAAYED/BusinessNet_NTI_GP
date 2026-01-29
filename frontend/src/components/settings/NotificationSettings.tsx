"use client";

import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AtSign, Heart, MessageCircle, UserPlus } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email: {
      likes: true,
      comments: true,
      mentions: true,
      follows: true,
      newsletter: false,
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

  const toggle = (type: 'email' | 'push', key: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !((prev[type] as any)[key])
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success toast
  };

  const sections = [
    {
      title: 'Interactions',
      description: 'How you want to be notified when people interact with your content.',
      items: [
        { key: 'likes', label: 'Likes', icon: Heart },
        { key: 'comments', label: 'Comments', icon: MessageCircle },
        { key: 'mentions', label: 'Mentions', icon: AtSign },
        { key: 'follows', label: 'New Followers', icon: UserPlus },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <Card key={idx} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-end gap-12 text-xs font-bold uppercase tracking-wider text-gray-400 px-4">
              <span className="w-12 text-center">Push</span>
              <span className="w-12 text-center">Email</span>
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.label}</h4>
                      <p className="text-xs text-gray-500">Notify me about new {item.label.toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="flex gap-12">
                    <button 
                      onClick={() => toggle('push', item.key)}
                      className={`w-12 flex justify-center p-2 rounded-lg transition-colors ${preferences.push[item.key as keyof typeof preferences.push] ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-300'}`}
                    >
                      <Smartphone className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggle('email', item.key)}
                      className={`w-12 flex justify-center p-2 rounded-lg transition-colors ${preferences.email[item.key as keyof typeof preferences.email] ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-300'}`}
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isLoading} className="px-8 rounded-xl h-12 shadow-lg hover:shadow-primary-500/20">
          Save Notification Preferences
        </Button>
      </div>
    </div>
  );
}
