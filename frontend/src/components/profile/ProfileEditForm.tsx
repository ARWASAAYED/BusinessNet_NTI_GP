"use client";

import React, { useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import userService, { User, UpdateProfileData } from '@/services/userService';

interface ProfileEditFormProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({ user, onSuccess, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: user.username,
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await userService.updateProfile(formData);
      if (onSuccess) onSuccess(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Avatar src={avatarPreview} alt={user.username} size="xl" className="ring-4 ring-white dark:ring-gray-950" />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                <Camera className="w-8 h-8" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4 dark:text-gray-400">Click to change profile picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your professional handle"
            required
            className="input-focus-glow"
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="input-focus-glow"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Tell us about yourself or your business..."
          />
        </div>

        <Input
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yourprofile.com"
          className="input-focus-glow"
        />

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            isLoading={isLoading}
            className="gradient-bg-primary hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
