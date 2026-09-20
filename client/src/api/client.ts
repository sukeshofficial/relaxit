import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios';
import { ENV } from '../config/env';
import { authStore } from '../store/authStore';
import type { ApiResponse, RefreshTokenRequest, RegisterResponse } from '../types/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/logout',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const isPublicAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPublicAuthEndpoint(config.url)) {
      delete config.headers.Authorization;
    } else {
      const token = authStore.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Custom property on InternalAxiosRequestConfig to prevent infinite retries
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Response Interceptor: 401 Single-Flight Token Refresh handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Do not trigger refresh loops for 401s on public auth endpoints
    if (isPublicAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue concurrent failed 401 requests
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err: Error) => Promise.reject(err));
      }

      isRefreshing = true;
      const currentRefreshToken = authStore.getRefreshToken();

      if (!currentRefreshToken) {
        authStore.clearAuth();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint without using main interceptors to prevent circular errors
        const refreshResponse = await axios.post<ApiResponse<RegisterResponse>>(
          `${ENV.API_BASE_URL}/auth/refresh-token`,
          { refreshToken: currentRefreshToken } as RefreshTokenRequest,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } =
            refreshResponse.data.data;

          authStore.setAuthSession(user, newAccessToken, newRefreshToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response reported unsuccess.');
        }
      } catch (refreshErr) {
        const errObj = refreshErr instanceof Error ? refreshErr : new Error('Token refresh failed');
        processQueue(errObj, null);
        authStore.clearAuth();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
