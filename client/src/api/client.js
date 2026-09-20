import axios, {} from 'axios';
import { ENV } from '../config/env';
import { authStore } from '../store/authStore';
export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        }
        else if (token) {
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
const isPublicAuthEndpoint = (url) => {
    if (!url)
        return false;
    return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};
// Request Interceptor: Attach bearer token to non-public request
apiClient.interceptors.request.use((config) => {
    const token = authStore.getAccessToken();
    if (token && !isPublicAuthEndpoint(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Response Interceptor: 401 Single-Flight Token Refresh handling
apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
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
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            })
                .catch((err) => Promise.reject(err));
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
            const refreshResponse = await axios.post(`${ENV.API_BASE_URL}/auth/refresh-token`, { refreshToken: currentRefreshToken }, { headers: { 'Content-Type': 'application/json' } });
            if (refreshResponse.data?.success && refreshResponse.data?.data) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = refreshResponse.data.data;
                authStore.setAuthSession(user, newAccessToken, newRefreshToken);
                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            }
            else {
                throw new Error('Refresh response reported unsuccess.');
            }
        }
        catch (refreshErr) {
            const errObj = refreshErr instanceof Error ? refreshErr : new Error('Token refresh failed');
            processQueue(errObj, null);
            authStore.clearAuth();
            return Promise.reject(refreshErr);
        }
        finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
