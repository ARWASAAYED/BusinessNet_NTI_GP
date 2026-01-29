"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Business } from '@/services/businessService';

interface BusinessCardProps {
  business: Business;
  onFollow?: () => void;
  isFollowing?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onFollow, isFollowing }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-none shadow-premium hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-950 group">
        {/* Cover Image with Gradient Overlay */}
        <div className="h-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          {business.coverImage ? (
            <img
              src={business.coverImage}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 animate-gradient-xy" />
          )}
          
          {/* Industry Badge - Glassmorphism */}
          <div className="absolute top-3 right-3 z-20">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              {business.category}
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col -mt-10 relative z-20">
          {/* Logo with Premium Border */}
          <div className="mb-4 inline-block">
            <div className="relative p-1 bg-white dark:bg-gray-950 rounded-2xl shadow-xl">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl">
                  {business.name.charAt(0)}
                </div>
              )}
              {business.verified && (
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-1 border-4 border-white dark:border-gray-950 shadow-lg">
                  <CheckCircle className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <Link href={`/business/${business._id}`}>
              <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors mb-1 tracking-tight">
                {business.name}
              </h3>
            </Link>
            
            {business.address?.city && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>
                  {business.address.city}
                  {business.address.country && `, ${business.address.country}`}
                </span>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">
              {business.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Reach</span>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{business.followers.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Trust</span>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{business.reputationScore}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {onFollow && (
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant={isFollowing ? 'outline' : 'primary'}
                onClick={onFollow}
                className={`w-full rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg transition-all ${
                  isFollowing 
                    ? 'border-2 border-primary-500 text-primary-500' 
                    : 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white hover:shadow-primary-500/25'
                }`}
              >
                {isFollowing ? 'Following Network' : 'Join Network'}
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
