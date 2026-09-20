import { apiClient } from './client';
import { authStore } from '../store/authStore';
export const userApi = {
    async getCurrentUser() {
        const res = await apiClient.get('/users/me');
        if (res.data.success && res.data.data) {
            authStore.setUser(res.data.data);
        }
        return res.data;
    },
    async updateProfile(data) {
        const res = await apiClient.put('/users/me', data);
        if (res.data.success && res.data.data) {
            authStore.setUser(res.data.data);
        }
        return res.data;
    },
    async changePassword(data) {
        const res = await apiClient.put('/users/me/password', data);
        return res.data;
    },
    async deleteAccount() {
        try {
            const res = await apiClient.delete('/users/me');
            return res.data;
        }
        finally {
            authStore.clearAuth();
        }
    },
};
