import { apiClient } from './client';
export const alertApi = {
    async getAlerts(deviceId, page = 0, size = 20, sort = 'createdAt,desc') {
        const res = await apiClient.get(`/devices/${deviceId}/alerts`, { params: { page, size, sort } });
        return res.data;
    },
    async acknowledgeAlert(deviceId, alertId) {
        const res = await apiClient.put(`/devices/${deviceId}/alerts/${alertId}/acknowledge`);
        return res.data;
    },
};
