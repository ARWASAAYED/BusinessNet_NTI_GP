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
  } | string;
  challenged: {
    _id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  } | string;
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
  winner?: {
    _id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  } | string;
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
    media?: File[];
  }): Promise<Duel> => {
    const formData = new FormData();
    formData.append('topic', data.topic);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('challengedId', data.challengedId);
    formData.append('category', data.category);
    if (data.durationHours) formData.append('durationHours', data.durationHours.toString());
    
    if (data.media) {
      data.media.forEach(file => formData.append('media', file));
    }

    const response = await api.post('/duels', formData);
    return response.data.data;
  },

  listDuels: async (category?: string, status?: string): Promise<Duel[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const response = await api.get(`/duels?${params.toString()}`);
    return response.data.data;
  },

  acceptDuel: async (id: string, submission: { content: string, media?: File[] }): Promise<Duel> => {
    const formData = new FormData();
    formData.append('content', submission.content);
    if (submission.media) {
      submission.media.forEach(file => formData.append('media', file));
    }

    const response = await api.post(`/duels/${id}/accept`, formData);
    return response.data.data;
  },

  vote: async (duelId: string, side: 'challenger' | 'challenged'): Promise<Duel> => {
    const response = await api.post(`/duels/${duelId}/vote`, { side });
    return response.data.data;
  },

  getDuel: async (duelId: string): Promise<Duel> => {
    const response = await api.get(`/duels/${duelId}`);
    return response.data.data;
  },

  finalize: async (duelId: string): Promise<Duel> => {
    const response = await api.post(`/duels/${duelId}/finalize`);
    return response.data.data;
  },
};

export default duelService;
