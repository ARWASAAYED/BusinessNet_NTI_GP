import axios, { AxiosInstance, AxiosError } from "axios";
import { API_URL } from "@/utils/constants";
import * as MOCK_DATA from "@/utils/mockData";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Mock Interceptor
if (USE_MOCK) {
  api.interceptors.request.use(async (config) => {
    console.warn(`[MOCK API] ${config.method?.toUpperCase()} ${config.url}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let data: any = null;

    if (config.url?.includes('/posts')) {
      data = { success: true, data: { posts: MOCK_DATA.MOCK_POSTS, hasMore: false } };
    } else if (config.url?.includes('/communities')) {
      data = { success: true, data: { communities: MOCK_DATA.MOCK_COMMUNITIES } };
    } else if (config.url?.includes('/trends')) {
      data = { success: true, data: MOCK_DATA.MOCK_TRENDS };
    } else if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      data = { 
        success: true, 
        token: 'mock-jwt-token',
        user: MOCK_DATA.MOCK_USERS[0]
      };
    } else if (config.url?.includes('/users/me') || config.url?.includes('/auth/me')) {
      data = { success: true, data: MOCK_DATA.MOCK_USERS[0] };
    } else if (config.url?.includes('/users/')) {
      // Mock profile search by ID
      const id = config.url.split('/').pop();
      const user = MOCK_DATA.MOCK_USERS.find(u => u.id === id || u._id === id) || MOCK_DATA.MOCK_USERS[0];
      data = { success: true, data: user };
    } else {
      data = { success: true, data: [] };
    }

    // Return a resolved promise with the mock data to bypass the actual request
    return Promise.reject({
      config,
      response: {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      }
    });
  });
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        delete (config.headers as any)["Content-Type"];
        delete (config.headers as any)["content-type"];
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // If it's our mock response, return it as success
    if (USE_MOCK && error.response && error.response.status === 200) {
      return Promise.resolve(error.response);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
