import { apiClient } from './client';
export const deviceApi = {
    async createDevice(data) {
        const res = await apiClient.post('/devices', data);
        return res.data;
    },
    async getDevices() {
        const res = await apiClient.get('/devices');
        return res.data;
    },
    async getDevice(deviceId) {
        const res = await apiClient.get(`/devices/${deviceId}`);
        return res.data;
    },
    async updateDevice(deviceId, data) {
        const res = await apiClient.put(`/devices/${deviceId}`, data);
        return res.data;
    },
    async deleteDevice(deviceId) {
        const res = await apiClient.delete(`/devices/${deviceId}`);
        return res.data;
    },
    async getDeviceStatus(deviceId) {
        const res = await apiClient.get(`/devices/${deviceId}/status`);
        return res.data;
    },
    async provisionDevice(deviceId) {
        const res = await apiClient.post(`/devices/${deviceId}/provision`);
        return res.data;
    },
};
