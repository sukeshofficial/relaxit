import { apiClient } from './client';
import type { AlertResponse, ApiResponse, PageResponse } from '../types/api';

export const alertApi = {
  async getAlerts(
    deviceId: string,
    page = 0,
    size = 5
  ): Promise<PageResponse<AlertResponse>> {
    const res = await apiClient.get<PageResponse<AlertResponse>>(
      `/devices/${deviceId}/alerts`,
      { params: { page, size } }
    );
    return res.data;
  },

  async acknowledgeAlert(
    alertId: string
  ): Promise<ApiResponse<void>> {
    const res = await apiClient.post<ApiResponse<void>>(
      `/alerts/${alertId}/acknowledge`
    );
    return res.data && typeof res.data === 'object' && 'success' in res.data
      ? res.data
      : { success: true, message: 'Alert acknowledged successfully', data: undefined };
  },
};
