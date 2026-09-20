import { apiClient } from './client';
export const sessionApi = {
    async getSessions(deviceId, page = 0, size = 20, sort = 'startTime,desc') {
        const res = await apiClient.get(`/devices/${deviceId}/sessions`, { params: { page, size, sort } });
        return res.data;
    },
    async getSession(deviceId, sessionId) {
        const res = await apiClient.get(`/devices/${deviceId}/sessions/${sessionId}`);
        return res.data;
    },
    async getActiveSession(deviceId) {
        const res = await apiClient.get(`/devices/${deviceId}/sessions/active`);
        return res.data;
    },
};
