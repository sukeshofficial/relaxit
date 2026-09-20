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

  async getDevices(): Promise<ApiResponse<DeviceResponse[]>> {
    const res = await apiClient.get<DeviceResponse[]>('/devices');
    let deviceList: DeviceResponse[] = [];
    if (Array.isArray(res.data)) {
      deviceList = res.data;
    } else if (res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray((res.data as unknown as ApiResponse<DeviceResponse[]>).data)) {
      deviceList = (res.data as unknown as ApiResponse<DeviceResponse[]>).data;
    } else if (Array.isArray(res)) {
      deviceList = res as unknown as DeviceResponse[];
    }

    return {
      success: true,
      message: 'Devices retrieved successfully',
      data: deviceList,
    };
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


