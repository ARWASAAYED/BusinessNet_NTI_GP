import api from './api';

export interface AIChatResponse {
  reply: string;
}

const aiService = {
  chatWithAI: async (message: string, context?: any): Promise<AIChatResponse> => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },
};

export default aiService;
