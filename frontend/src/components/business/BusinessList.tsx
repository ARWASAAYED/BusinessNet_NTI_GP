"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BusinessCard from './BusinessCard';
import Spinner from '../common/Spinner';
import businessService, { Business } from '@/services/businessService';
import { useAuth } from '@/hooks/useAuth';

interface BusinessListProps {
  category?: string;
  userId?: string;
  searchQuery?: string;
  className?: string;
}

const BusinessList: React.FC<BusinessListProps> = ({ category, userId, searchQuery, className }) => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBusinesses();
  }, [category, userId, searchQuery]);

  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Business[] = [];

      if (searchQuery) {
        data = await businessService.searchBusinesses(searchQuery, category);
      } else if (userId) {
        data = await businessService.getUserBusinesses(userId);
      } else if (category) {
        const result = await businessService.getByCategory(category);
        data = result.businesses || result;
      } else {
        // Get all businesses if no filter
        const result = await businessService.getByCategory('All');
        data = result.businesses || result || [];
      }

      setBusinesses(data);

      // Initialize following state
      if (user) {
        const userId = user.id || user._id;
        const following = new Set<string>();
        data.forEach(business => {
          if (userId && business.followers.includes(userId)) {
            following.add(business._id);
          }
        });
        setFollowingIds(following);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (businessId: string) => {
    if (!user) return;

    const isFollowing = followingIds.has(businessId);

    // Optimistic update
    const newFollowingIds = new Set(followingIds);
    if (isFollowing) {
      newFollowingIds.delete(businessId);
    } else {
      newFollowingIds.add(businessId);
    }
    setFollowingIds(newFollowingIds);

    try {
      if (isFollowing) {
        await businessService.unfollowBusiness(businessId);
      } else {
        await businessService.followBusiness(businessId);
      }
    } catch (err: any) {
      // Revert on error
      setFollowingIds(followingIds);
      console.error('Failed to update follow status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadBusinesses}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No businesses found</p>
        {searchQuery && <p className="text-sm mt-2">Try adjusting your search</p>}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}>
      {businesses.map((business, index) => (
        <motion.div
          key={business._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BusinessCard
            business={business}
            onFollow={() => handleFollow(business._id)}
            isFollowing={followingIds.has(business._id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BusinessList;
