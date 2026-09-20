import { apiClient } from './client';
import type {
  ApiResponse,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceResponse,
  ProvisionDeviceResponse,
  DeviceStatusResponse,
} from '../types/api';


export const deviceApi = {
  async createDevice(data: CreateDeviceRequest): Promise<ApiResponse<DeviceResponse>> {
    const res = await apiClient.post<DeviceResponse>('/devices', data);
    return {
      success: true,
      message: 'Device created successfully',
      data: res.data,
    };
  },

  async getDevices(): Promise<DeviceResponse[]> {
    const res = await apiClient.get<DeviceResponse[]>('/devices');
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    const inner = (raw as unknown as { data?: DeviceResponse[] })?.data;
    return Array.isArray(inner) ? inner : [];
  },



  async getDevice(deviceId: string): Promise<ApiResponse<DeviceResponse>> {
    const res = await apiClient.get<DeviceResponse>(`/devices/${deviceId}`);
    return {
      success: true,
      message: 'Device retrieved successfully',
      data: res.data,
    };
  },

  async updateDevice(
    deviceId: string,
    data: UpdateDeviceRequest
  ): Promise<ApiResponse<DeviceResponse>> {
    const res = await apiClient.put<DeviceResponse>(`/devices/${deviceId}`, data);
    return {
      success: true,
      message: 'Device updated successfully',
      data: res.data,
    };
  },

  async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    const res = await apiClient.delete<ApiResponse<void>>(`/devices/${deviceId}`);
    return res.data && typeof res.data === 'object' && 'success' in res.data
      ? res.data
      : { success: true, message: 'Device successfully deleted/unpaired', data: undefined };
  },

  async getDeviceStatus(deviceId: string): Promise<ApiResponse<DeviceStatusResponse>> {
    const res = await apiClient.get<DeviceStatusResponse>(`/devices/${deviceId}/status`);
    return {
      success: true,
      message: 'Device status retrieved successfully',
      data: res.data,
    };
  },

  async provisionDevice(deviceId: string): Promise<ApiResponse<ProvisionDeviceResponse>> {
    const res = await apiClient.post<ProvisionDeviceResponse>(`/devices/${deviceId}/provision`);
    return {
      success: true,
      message: 'Device provisioned successfully',
      data: res.data,
    };
  },
};


