"use client";

import React from 'react';
import { ExternalLink, Info, TrendingUp } from 'lucide-react';
import PostCard from '../post/PostCard';
import { Post } from '@/services/postService';
import Badge from '../common/Badge';

interface PromotedPostCardProps {
  post: Post;
  ctaText?: string;
  ctaUrl?: string;
}

export default function PromotedPostCard({ post, ctaText = "Learn More", ctaUrl }: PromotedPostCardProps) {
  // We wrap the standard PostCard with some promotion-specific UI
  return (
    <div className="relative group">
      {/* Promotion Label */}
      <div className="absolute -top-3 left-4 z-10">
        <Badge 
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none shadow-lg py-1 px-3 flex items-center gap-1.5"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Promoted</span>
        </Badge>
      </div>

      <div className="border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/5 group-hover:shadow-amber-500/10 transition-shadow">
        <PostCard post={{ ...post, isPromoted: true }} />
        
        {/* CTA Section */}
        <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 flex items-center justify-between border-t border-amber-100 dark:border-amber-900/20">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
            <Info className="w-4 h-4" />
            <span className="text-xs font-medium">Verified Business Partner</span>
          </div>
          <button 
            onClick={() => ctaUrl && window.open(ctaUrl, '_blank')}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105"
          >
            {ctaText}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
