import { apiClient } from './client';
import type { ApiResponse, DeviceEventResponse, PageResponse } from '../types/api';

export const eventApi = {
  async getEvents(
    deviceId: number,
    page = 0,
    size = 20,
    sort = 'timestamp,desc'
  ): Promise<ApiResponse<PageResponse<DeviceEventResponse>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<DeviceEventResponse>>>(
      `/devices/${deviceId}/events`,
      { params: { page, size, sort } }
    );
    return res.data;
  },
};
