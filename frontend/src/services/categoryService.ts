import api from './api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentId?: Category | string;
}

const categoryService = {
  getCategories: async (rootOnly = false): Promise<Category[]> => {
    const response = await api.get(`/categories${rootOnly ? '?root=true' : ''}`);
    return response.data.categories;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.category;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
