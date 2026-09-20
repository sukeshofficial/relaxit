import { apiClient } from './client';
import type { PageResponse, PostureResponse } from '../types/api';

export const postureApi = {
  async getPostureHistoryList(
    deviceId: string,
    from?: string,
    to?: string
  ): Promise<PostureResponse[]> {
    const res = await apiClient.get<PostureResponse[]>(
      `/devices/${deviceId}/posture`,
      { params: { from, to } }
    );
    return Array.isArray(res.data) ? res.data : [];
  },

  async getPostureHistoryPage(
    deviceId: string,
    page = 0,
    size = 20,
    from?: string,
    to?: string
  ): Promise<PageResponse<PostureResponse>> {
    const res = await apiClient.get<PageResponse<PostureResponse>>(
      `/devices/${deviceId}/posture/page`,
      { params: { page, size, from, to } }
    );
    return res.data;
  },
};
