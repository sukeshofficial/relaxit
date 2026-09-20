import { apiClient } from './client';
import type { PageResponse, SessionResponse } from '../types/api';

export const sessionApi = {
  async getSessions(
    deviceId: string,
    page = 0,
    size = 5
  ): Promise<PageResponse<SessionResponse>> {
    const res = await apiClient.get<PageResponse<SessionResponse>>(
      `/devices/${deviceId}/sessions`,
      { params: { page, size } }
    );
    return res.data;
  },

  async getSession(
    deviceId: string,
    sessionId: string
  ): Promise<SessionResponse> {
    const res = await apiClient.get<SessionResponse>(
      `/devices/${deviceId}/sessions/${sessionId}`
    );
    return res.data;
  },
};
