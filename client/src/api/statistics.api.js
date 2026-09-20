import { apiClient } from './client';
export const statisticsApi = {
    async getDeviceStatistics(deviceId) {
        const res = await apiClient.get(`/devices/${deviceId}/statistics`);
        return res.data;
    },
};
