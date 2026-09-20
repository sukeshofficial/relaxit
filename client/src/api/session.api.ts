import { apiClient } from './client';
import type { ApiResponse, PageResponse, SessionResponse } from '../types/api';

export const sessionApi = {
  async getSessions(
    deviceId: number,
    page = 0,
    size = 20,
    sort = 'startTime,desc'
  ): Promise<ApiResponse<PageResponse<SessionResponse>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<SessionResponse>>>(
      `/devices/${deviceId}/sessions`,
      { params: { page, size, sort } }
    );
    return res.data;
  },

  async getSession(
    deviceId: number,
    sessionId: number
  ): Promise<ApiResponse<SessionResponse>> {
    const res = await apiClient.get<ApiResponse<SessionResponse>>(
      `/devices/${deviceId}/sessions/${sessionId}`
    );
    return res.data;
  },

  async getActiveSession(deviceId: number): Promise<ApiResponse<SessionResponse>> {
    const res = await apiClient.get<ApiResponse<SessionResponse>>(
      `/devices/${deviceId}/sessions/active`
    );
    return res.data;
  },
};
