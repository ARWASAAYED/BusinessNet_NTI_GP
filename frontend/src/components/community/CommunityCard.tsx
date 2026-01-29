"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Lock, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Community } from '@/services/communityService';

interface CommunityCardProps {
  community: Community;
  onJoin?: () => void;
  isMember?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onJoin, isMember }) => {
  const getFullUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
          {community.coverImage && (
            <img
              src={getFullUrl(community.coverImage)}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          )}
          {community.isPrivate && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
              <Lock className="w-4 h-4 text-gray-700" />
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Name and Category */}
          <div className="mb-3">
            <Link href={`/communities/${community._id}`}>
              <h3 className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors mb-2">
                {community.name}
              </h3>
            </Link>
            <Badge variant="secondary" size="sm">
              {community.category}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{community.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{community.isPrivate ? 'Private' : 'Public'}</span>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Created by{' '}
              <Link
                href={`/profile/${community.createdBy._id}`}
                className="text-primary-600 hover:underline"
              >
                {community.createdBy.username}
              </Link>
            </span>
          </div>

          {/* Action Button */}
          {onJoin && (
            <Button
              variant={isMember ? 'outline' : 'primary'}
              size="sm"
              onClick={onJoin}
              className="w-full"
            >
              {isMember ? 'Joined' : 'Join Community'}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CommunityCard;
