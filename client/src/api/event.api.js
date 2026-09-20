import { apiClient } from './client';
export const eventApi = {
    async getEvents(deviceId, page = 0, size = 20, sort = 'timestamp,desc') {
        const res = await apiClient.get(`/devices/${deviceId}/events`, { params: { page, size, sort } });
        return res.data;
    },
};
