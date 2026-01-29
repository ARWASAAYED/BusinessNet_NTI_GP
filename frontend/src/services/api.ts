import axios, { AxiosInstance, AxiosError } from "axios";
import { API_URL } from "@/utils/constants";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If we're sending FormData (file uploads), let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      // Remove default content-type so axios/browser sets the proper multipart/form-data boundary
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
