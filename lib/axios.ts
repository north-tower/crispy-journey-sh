// src/lib/axios.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from './store/authStore';

// Define custom error types
export interface ApiError {
  message: string;
  status: number;
  data?: unknown; // Replace `any` with `unknown` for stricter typing
}

// Type for the API response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// Create API client with type safety
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with proper typing
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError): Promise<ApiError> => {
    return Promise.reject({
      message: error.message,
      status: error.response?.status || 500,
      data: error.response?.data,
    });
  },
);

// Response interceptor with enhanced error handling and retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Type guard to ensure originalRequest exists
    if (!originalRequest) {
      return Promise.reject({
        message: 'No request config available',
        status: 500,
      });
    }

    try {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const authStore = useAuthStore.getState();

        // Attempt to refresh the token
        await authStore.refreshAccessToken();
        const newAccessToken = authStore.accessToken;

        // If token refresh was successful, retry the original request
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          // If no new token was obtained, logout and reject
          await authStore.logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      // Handle other error cases
      const errorResponse: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred',
        status: error.response?.status || 500,
        data: error.response?.data,
      };

      return Promise.reject(errorResponse);
    } catch {
      // Handle errors during the refresh token process
      return Promise.reject({
        message: 'Authentication failed. Please login again.',
        status: 401,
      });
    }
  },
);

// Helper methods for common API operations
export const api = {
  get: async <T>(url: string, config = {}): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data: Record<string, unknown> = {}, config = {}): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data: Record<string, unknown> = {}, config = {}): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data: Record<string, unknown> = {}, config = {}): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config = {}): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

export default apiClient;
