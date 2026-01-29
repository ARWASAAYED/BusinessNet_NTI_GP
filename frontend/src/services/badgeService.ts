import api from './api';

export interface Badge {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  requirement: string;
}

export interface UserBadge extends Badge {
  earnedAt: string;
  progress?: number;
}

const badgeService = {
  getUserBadges: async (userId: string): Promise<UserBadge[]> => {
    const response = await api.get(`/users/${userId}/badges`);
    return response.data.data;
  },

  getAvailableBadges: async (): Promise<Badge[]> => {
    const response = await api.get('/badges');
    return response.data.data;
  },

  getBadgeById: async (badgeId: string): Promise<Badge> => {
    const response = await api.get(`/badges/${badgeId}`);
    return response.data.data;
  },
};

export default badgeService;
