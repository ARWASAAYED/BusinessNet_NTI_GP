"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BusinessList from '@/components/business/BusinessList';
import Button from '@/components/common/Button';

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    { name: 'All', icon: <Search className="w-3 h-3" /> },
    { name: 'Technology', icon: <Search className="w-3 h-3" /> },
    { name: 'Finance', icon: <Search className="w-3 h-3" /> },
    { name: 'Healthcare', icon: <Search className="w-3 h-3" /> },
    { name: 'Education', icon: <Search className="w-3 h-3" /> },
    { name: 'Retail', icon: <Search className="w-3 h-3" /> },
    { name: 'Manufacturing', icon: <Search className="w-3 h-3" /> },
    { name: 'Services', icon: <Search className="w-3 h-3" /> },
    { name: 'Real Estate', icon: <Search className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Hero Section */}
      <div className="relative h-[400px] mb-12 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-800 animate-gradient-xy" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-none">
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-primary-300">Business</span> Ecosystem
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with high-growth ventures, service providers, and verified industry leaders in our global network.
            </p>
          </motion.div>

          {/* Integrated Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="glass-card p-2 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-2">
              <Search className="w-6 h-6 text-white/60 ml-4" />
              <input
                type="text"
                placeholder="Find specialized services or verified partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 font-medium text-lg py-3"
              />
              <Button variant="primary" className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Category Selector */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Browse Industries</h2>
            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-white/5 mx-8" />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name === 'All' ? '' : cat.name)}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border-2 font-black uppercase tracking-widest text-[10px] ${
                  (cat.name === 'All' && !selectedCategory) || cat.name === selectedCategory
                    ? 'bg-primary-500 text-white border-primary-500 shadow-xl shadow-primary-500/25'
                    : 'bg-white dark:bg-gray-950 text-gray-500 border-gray-100 dark:border-gray-800 hover:border-primary-500/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Business List Grid */}
        <div className="relative min-h-[400px]">
          <BusinessList
            searchQuery={searchQuery}
            category={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
