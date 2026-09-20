import { apiClient } from './client';
import type { ApiResponse, DeviceStatisticsResponse } from '../types/api';

export const statisticsApi = {
  async getDeviceStatistics(
    deviceId: number
  ): Promise<ApiResponse<DeviceStatisticsResponse>> {
    const res = await apiClient.get<ApiResponse<DeviceStatisticsResponse>>(
      `/devices/${deviceId}/statistics`
    );
    return res.data;
  },
};
