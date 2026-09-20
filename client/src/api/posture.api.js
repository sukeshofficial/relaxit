import { apiClient } from './client';
export const postureApi = {
    async getLatestPosture(deviceId) {
        const res = await apiClient.get(`/devices/${deviceId}/posture/latest`);
        return res.data;
    },
    async getPostureHistory(deviceId, page = 0, size = 20, sort = 'timestamp,desc') {
        const res = await apiClient.get(`/devices/${deviceId}/posture/page`, { params: { page, size, sort } });
        return res.data;
    },
};
