"use client";

import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import Portal from '../common/Portal';
import communityService from '@/services/communityService';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useToast } from '@/app/providers';

interface CommunityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CommunityCreateModal({ isOpen, onClose, onSuccess }: CommunityCreateModalProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Technology', 'Business', 'Marketing', 'Design',
    'Finance', 'Healthcare', 'Education', 'Entertainment'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category) return;

    setIsLoading(true);
    try {
      await communityService.createCommunity({
        name,
        description,
        category,
        isPrivate,
        coverImage: coverImage || undefined
      });
      showToast(t('communities.createSuccess') || 'Community created successfully!', 'success');
      onSuccess();
      onClose();
      setName('');
      setDescription('');
      setCategory('');
      setIsPrivate(false);
      setCoverImage(null);
      setPreview(null);
    } catch (error: any) {
      console.error('Failed to create community:', error);
      const msg = error?.response?.data?.message || t('communities.createFailed') || 'Failed to create community.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center flex-shrink-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur rounded-t-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('communities.create')}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-40 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-colors"
            >
              {preview ? (
                <img src={preview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm">{t('communities.uploadCover')}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('communities.communityName')}</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('communities.namePlaceholder')}
                  required
                  dir="auto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('communities.description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('communities.descriptionPlaceholder')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 h-24 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('feed.categoryLabel')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100"
                    required
                  >
                    <option value="">{t('communities.selectCategory')}</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{t(`categories.${c}`, c)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('communities.privacy')}</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${!isPrivate ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-200 dark:border-gray-800 text-gray-500'}`}
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{t('communities.public')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${isPrivate ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-200 dark:border-gray-800 text-gray-500'}`}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">{t('communities.private')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1" type="button">{t('common.cancel')}</Button>
              <Button variant="primary" type="submit" isLoading={isLoading} className="flex-1">{t('communities.create')}</Button>
            </div>
          </form>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
