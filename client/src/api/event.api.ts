import { apiClient } from './client';
import type { DeviceEventResponse, PageResponse } from '../types/api';

export const eventApi = {
  async getEvents(
    deviceId: string,
    page = 0,
    size = 5
  ): Promise<PageResponse<DeviceEventResponse>> {
    const res = await apiClient.get<PageResponse<DeviceEventResponse>>(
      `/devices/${deviceId}/events`,
      { params: { page, size } }
    );
    return res.data;
  },
};
