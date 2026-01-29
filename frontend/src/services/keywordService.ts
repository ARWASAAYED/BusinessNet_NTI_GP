import api from './api';

export interface Keyword {
  _id: string;
  word: string;
  category?: string;
  frequency: number;
  growthRate: number;
  avgSentiment: number;
  hypeProbability: number;
}

const keywordService = {
  getAllKeywords: async (limit = 50, sort = 'frequency'): Promise<Keyword[]> => {
    const response = await api.get(`/keywords?limit=${limit}&sort=${sort}`);
    return response.data.keywords;
  },

  getKeywordStats: async (id: string): Promise<Keyword> => {
    const response = await api.get(`/keywords/${id}`);
    return response.data.keyword;
  },
};

export default keywordService;
