import { apiClient } from './client';
import { authStore } from '../store/authStore';
export const authApi = {
    async register(data) {
        const res = await apiClient.post('/auth/register', data);
        return res.data;
    },
    async login(data) {
        const res = await apiClient.post('/auth/login', data);
        if (res.data.success && res.data.data) {
            const { user, accessToken, refreshToken } = res.data.data;
            authStore.setAuthSession(user, accessToken, refreshToken);
        }
        return res.data;
    },
    async refreshToken(data) {
        const res = await apiClient.post('/auth/refresh-token', data);
        if (res.data.success && res.data.data) {
            const { user, accessToken, refreshToken } = res.data.data;
            authStore.setAuthSession(user, accessToken, refreshToken);
        }
        return res.data;
    },
    async logout(data) {
        try {
            const res = await apiClient.post('/auth/logout', data || {});
            return res.data;
        }
        finally {
            authStore.clearAuth();
        }
    },
    async verifyEmail(data) {
        const res = await apiClient.post('/auth/verify-email', data);
        return res.data;
    },
    async forgotPassword(data) {
        const res = await apiClient.post('/auth/forgot-password', data);
        return res.data;
    },
    async resetPassword(data) {
        const res = await apiClient.post('/auth/reset-password', data);
        return res.data;
    },
};
