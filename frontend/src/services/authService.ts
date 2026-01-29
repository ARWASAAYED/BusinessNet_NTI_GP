import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'business';
  category?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    _id?: string;
    username: string;
    email: string;
    accountType: string;
    avatar?: string;
    fullName?: string;
    role?: string;
    businessId?: string;
  };
}

// Real API service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const authData = response.data.data || response.data;
      if (authData && authData.token) {
        localStorage.setItem('token', authData.token);
        if (authData.user) {
          localStorage.setItem('currentUser', JSON.stringify(authData.user));
        }
      }
      return authData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed';
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegisterData & { avatar?: File }): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.role);
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }
      if (data.category) {
        formData.append('category', data.category);
      }

      const response = await api.post('/auth/register', formData);
      const authData = response.data.data || response.data;
      if (authData && authData.token) {
        localStorage.setItem('token', authData.token);
        if (authData.user) {
          localStorage.setItem('currentUser', JSON.stringify(authData.user));
        }
      }
      return authData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to get user';
      throw new Error(errorMessage);
    }
  },
};
