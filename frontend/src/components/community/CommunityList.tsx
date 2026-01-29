"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommunityCard from './CommunityCard';
import Spinner from '../common/Spinner';
import communityService, { Community } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { usePopup } from '../common/PopupProvider';

interface CommunityListProps {
  category?: string;
  searchQuery?: string;
}

const CommunityList: React.FC<CommunityListProps> = ({ category, searchQuery }) => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCommunities();
  }, [category, searchQuery]);

  const loadCommunities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Community[] = [];

      if (searchQuery) {
        data = await communityService.searchCommunities(searchQuery);
      } else if (category) {
        data = await communityService.getByCategory(category);
      } else {
        const result = await communityService.getCommunities();
        data = result.communities;
      }

      setCommunities(data);

      // Initialize member state
      if (user) {
        const userId = user.id || user._id;
        const members = new Set<string>();
        data.forEach(community => {
          if (userId && community.members.includes(userId)) {
            members.add(community._id);
          }
        });
        setMemberIds(members);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  const { showSuccess, showError } = usePopup();

  const handleJoin = async (communityId: string) => {
    if (!user) return;

    const isMember = memberIds.has(communityId);
    const community = communities.find(c => c._id === communityId);

    // Optimistic update
    const newMemberIds = new Set(memberIds);
    if (isMember) {
      newMemberIds.delete(communityId);
    } else {
      newMemberIds.add(communityId);
    }
    setMemberIds(newMemberIds);

    try {
      if (isMember) {
        await communityService.leaveCommunity(communityId);
        showSuccess(`You have left ${community?.name || 'the community'}`);
      } else {
        await communityService.joinCommunity(communityId);
        showSuccess(`Welcome to ${community?.name || 'the community'}!`);
      }
      
      // Dispatch event to refresh sidebar
      window.dispatchEvent(new CustomEvent('community:updated'));
    } catch (err: any) {
      // Revert on error
      setMemberIds(memberIds);
      showError(err.message || 'Failed to update membership');
      console.error('Failed to update membership:', err);
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
          onClick={loadCommunities}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No communities found</p>
        {searchQuery && <p className="text-sm mt-2">Try adjusting your search</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community, index) => (
        <motion.div
          key={community._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CommunityCard
            community={community}
            onJoin={() => handleJoin(community._id)}
            isMember={memberIds.has(community._id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CommunityList;
