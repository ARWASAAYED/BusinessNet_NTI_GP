"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Users, Building2, MessageSquare } from 'lucide-react';
import PostCard from '@/components/post/PostCard';
import Avatar from '@/components/common/Avatar';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import postService, { Post } from '@/services/postService';
import userService, { User } from '@/services/userService';
import businessService, { Business } from '@/services/businessService';

import communityService, { Community } from '@/services/communityService';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'businesses' | 'communities'>('posts');
  const [results, setResults] = useState<{ posts: Post[], users: User[], businesses: Business[], communities: Community[] }>({
    posts: [],
    users: [],
    businesses: [],
    communities: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [postsData, usersData, businessesData, communitiesData] = await Promise.all([
          postService.searchPosts(query),
          userService.searchUsers(query),
          businessService.searchBusinesses(query),
          communityService.searchCommunities(query)
        ]);
        
        setResults({
          posts: postsData.posts || [],
          users: usersData || [],
          businesses: businessesData || [],
          communities: communitiesData || []
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Search className="w-6 h-6 text-primary-600" />
          {query ? `Search results for "${query}"` : 'Enter a search term'}
        </h1>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 sticky top-16 bg-white dark:bg-gray-950 z-10 py-2">
        {[
          { id: 'posts', label: 'Posts', icon: MessageSquare, count: results.posts.length },
          { id: 'users', label: 'People', icon: Users, count: results.users.length },
          { id: 'businesses', label: 'Businesses', icon: Building2, count: results.businesses.length },
          { id: 'communities', label: 'Communities', icon: Users, count: results.communities.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'posts' && (
            results.posts.length > 0 ? (
              results.posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
              <p className="text-center py-10 text-gray-500">No posts found</p>
            )
          )}

          {activeTab === 'users' && (
            results.users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.users.map(user => (
                  <Card key={user._id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/profile/${user._id}`)}>
                    <Avatar src={user.avatar} alt={user.username} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{user.username}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{user.bio || 'Professional Member'}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500">No people found</p>
            )
          )}

          {activeTab === 'businesses' && (
            results.businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.businesses.map(biz => (
                  <Card key={biz._id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/business/${biz._id}`)}>
                    <Avatar src={biz.logo} alt={biz.name} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{biz.name}</h3>
                      <p className="text-sm text-gray-500">{biz.category}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500">No businesses found</p>
            )
          )}

          {activeTab === 'communities' && (
            results.communities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.communities.map(comm => (
                  <Card key={comm._id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/communities/${comm._id}`)}>
                    <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xl">
                      {comm.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{comm.name}</h3>
                      <p className="text-sm text-gray-500">{comm.memberCount} members</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500">No communities found</p>
            )
          )}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
