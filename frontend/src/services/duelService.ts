import api from './api';

export interface Duel {
  _id: string;
  topic: string;
  description: string;
  challenger: {
    _id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  challenged: {
    _id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  challengerSubmission?: {
    content: string;
    media: string[];
    votes: string[];
  };
  challengedSubmission?: {
    content: string;
    media: string[];
    votes: string[];
  };
  category: string;
  status: 'pending' | 'active' | 'completed';
  expiresAt: string;
  winner?: string;
  createdAt: string;
}

const duelService = {
  createDuel: async (data: {
    topic: string;
    description: string;
    content: string;
    challengedId: string;
    category: string;
    durationHours?: number;
  }): Promise<Duel> => {
    const response = await api.post('/duels', data);
    return response.data.data;
  },

  listDuels: async (category?: string): Promise<Duel[]> => {
    const response = await api.get(`/duels${category ? `?category=${category}` : ''}`);
    return response.data.data;
  },

  acceptDuel: async (id: string, submission: { content: string, media?: string[] }): Promise<Duel> => {
    const response = await api.post(`/duels/${id}/accept`, submission);
    return response.data.data;
  },

  vote: async (id: string, side: 'challenger' | 'challenged'): Promise<Duel> => {
    const response = await api.post(`/duels/${id}/vote`, { side });
    return response.data.data;
  }
};

export default duelService;
