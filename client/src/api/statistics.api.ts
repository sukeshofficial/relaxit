import { apiClient } from './client';
import type { DeviceStatisticsResponse } from '../types/api';

export const statisticsApi = {
  async getDeviceStatistics(
    deviceId: string,
    date?: string
  ): Promise<DeviceStatisticsResponse> {
    const res = await apiClient.get<DeviceStatisticsResponse>(
      `/devices/${deviceId}/statistics`,
      { params: date ? { date } : {} }
    );
    return res.data;
  },
};
