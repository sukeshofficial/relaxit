import { apiClient } from './client';
import type { AlertResponse, ApiResponse, PageResponse } from '../types/api';

export const alertApi = {
  async getAlerts(
    deviceId: number,
    page = 0,
    size = 20,
    sort = 'createdAt,desc'
  ): Promise<ApiResponse<PageResponse<AlertResponse>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<AlertResponse>>>(
      `/devices/${deviceId}/alerts`,
      { params: { page, size, sort } }
    );
    return res.data;
  },

  async acknowledgeAlert(
    deviceId: number,
    alertId: number
  ): Promise<ApiResponse<AlertResponse>> {
    const res = await apiClient.put<ApiResponse<AlertResponse>>(
      `/devices/${deviceId}/alerts/${alertId}/acknowledge`
    );
    return res.data;
  },
};
