"use client";

import React, { useEffect, useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import userService, { User } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Spinner from '../common/Spinner';
import Button from '../common/Button';

const ConnectionSuggestions: React.FC = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await userService.searchUsers('');
        // Filter out self and maybe people already followed
        const filtered = data.filter(u => u._id !== user?._id && u._id !== user?.id).slice(0, 5);
        setSuggestions(filtered);
      } catch (error) {
        console.error('Failed to load connection suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) loadSuggestions();
  }, [user]);

  const handleFollow = async (userId: string) => {
    try {
      await userService.followUser(userId);
      setSuggestions(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <Card className="p-4 bg-white dark:bg-gray-950">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg text-white shadow-md shadow-secondary-500/30">
          <Users className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-gray-900 dark:text-gray-100">Suggested Connections</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner size="sm" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-center py-4 text-sm text-gray-500">No new suggestions</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestedUser) => (
            <div key={suggestedUser._id} className="flex items-center gap-3">
              <Avatar src={suggestedUser.avatar} alt={suggestedUser.username} size="sm" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{suggestedUser.username}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{suggestedUser.bio || 'Member'}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 rounded-full text-xs"
                onClick={() => handleFollow(suggestedUser._id)}
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
export default ConnectionSuggestions;
