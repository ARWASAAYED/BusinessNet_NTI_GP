import axios, { AxiosInstance, AxiosError } from "axios";
import { API_URL } from "@/utils/constants";

// FRONTEND ONLY MODE - Set to false to use real backend API
const BACKEND_DISABLED = false;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Mock data generator for offline fallback only
const generateMockData = (url: string): any => {
  // Trends
  if (url.includes("/trends/topics")) {
    return {
      data: [
        {
          name: "Technology",
          count: 15420,
          growth: 23.5,
          category: "Technology",
        },
        { name: "Web3", count: 12350, growth: 18.2, category: "Technology" },
        {
          name: "AI & Machine Learning",
          count: 11200,
          growth: 45.8,
          category: "Technology",
        },
        { name: "Startups", count: 9870, growth: 12.3, category: "Business" },
        {
          name: "Finance Markets",
          count: 8540,
          growth: 8.5,
          category: "Finance",
        },
      ],
      success: true,
    };
  }

  if (url.includes("/trends/posts")) {
    return {
      data: {
        posts: [
          {
            id: "1",
            title: "Breaking: New Tech Trends",
            content: "Lorem ipsum...",
            author: "User1",
            date: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Web3 Revolution",
            content: "Lorem ipsum...",
            author: "User2",
            date: new Date().toISOString(),
          },
        ],
        hasMore: true,
      },
      success: true,
    };
  }

  // Posts
  if (url.includes("/posts")) {
    return {
      data: [
        {
          id: "1",
          title: "Sample Post",
          content: "This is mock data",
          author: "User1",
          likes: 100,
          comments: 20,
        },
      ],
      success: true,
    };
  }

  // Default mock response
  return {
    data: [],
    success: true,
    message: "Offline fallback response",
  };
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If we're sending FormData (file uploads), let the browser set the Content-Type with boundary
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
  },
);

// Response interceptor - handle 401 and errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only return mock data if backend is explicitly disabled
    if (BACKEND_DISABLED) {
      const url = error.config?.url || "";
      const mockData = generateMockData(url);
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: "OK (Mock)",
        headers: {},
        config: error.config,
      } as any);
    }

    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/signup") || url.includes("/auth/register");
      
      // If unauthorized on a protected route, clear stale token
      if (!isAuthEndpoint) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
