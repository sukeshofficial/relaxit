import { apiClient } from './client';
import type { ApiResponse, PageResponse, PostureResponse } from '../types/api';

export const postureApi = {
  async getLatestPosture(deviceId: number): Promise<ApiResponse<PostureResponse>> {
    const res = await apiClient.get<ApiResponse<PostureResponse>>(
      `/devices/${deviceId}/posture/latest`
    );
    return res.data;
  },

  async getPostureHistory(
    deviceId: number,
    page = 0,
    size = 20,
    sort = 'timestamp,desc'
  ): Promise<ApiResponse<PageResponse<PostureResponse>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<PostureResponse>>>(
      `/devices/${deviceId}/posture/page`,
      { params: { page, size, sort } }
    );
    return res.data;
  },
};
