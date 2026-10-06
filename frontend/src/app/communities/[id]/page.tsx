"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/community/CommunityDetail';

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <CommunityDetail communityId={id} />
    </div>
  );
}
