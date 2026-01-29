"use client";

import React, { useState } from 'react';
import { Shield, Key, Smartphone, History, Lock } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Change Password</h3>
            <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <Input 
              type="password" 
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <Input 
              type="password" 
              value={passwords.new}
              onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
            <Input 
              type="password" 
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
            />
          </div>
          <Button type="submit" isLoading={isLoading} className="w-full h-12 rounded-xl">
            Update Password
          </Button>
        </form>
      </Card>

      <Card className="p-8 border-none bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-900">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            Enable 2FA
          </Button>
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Login Sessions</h3>
        </div>
        <div className="space-y-4">
          {[
            { device: 'Chromium on Windows', location: 'New York, USA', time: 'Active now', isCurrent: true },
            { device: 'Safari on iPhone', location: 'London, UK', time: '2 days ago', isCurrent: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{session.device}</p>
                    {session.isCurrent && <Badge variant="success" size="sm">Current Session</Badge>}
                  </div>
                  <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                </div>
              </div>
              {!session.isCurrent && (
                <button className="text-sm text-red-600 font-medium hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
