import { apiClient } from './client';
export const measurementApi = {
    async getMeasurements(deviceId, page = 0, size = 20, sort = 'timestamp,desc') {
        const res = await apiClient.get(`/devices/${deviceId}/measurements`, { params: { page, size, sort } });
        return res.data;
    },
};
