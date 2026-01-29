"use client";

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CommunityList from '@/components/community/CommunityList';
import CommunityCreateModal from '@/components/community/CommunityCreateModal';

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Business',
    'Marketing',
    'Design',
    'Finance',
    'Healthcare',
    'Education',
    'Entertainment',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Communities</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Discover and join communities around your interests
            </p>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Create Community
          </Button>
        </div>

        <CommunityCreateModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                (category === 'All' && !selectedCategory) ||
                category === selectedCategory
                  ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-primary-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Communities List */}
      <CommunityList
        searchQuery={searchQuery}
        category={selectedCategory}
      />
    </div>
  );
}
