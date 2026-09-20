import { apiClient } from './client';
import type { ApiResponse, PageResponse, SensorMeasurementResponse } from '../types/api';

export const measurementApi = {
  async getMeasurements(
    deviceId: number,
    page = 0,
    size = 20,
    sort = 'timestamp,desc'
  ): Promise<ApiResponse<PageResponse<SensorMeasurementResponse>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<SensorMeasurementResponse>>>(
      `/devices/${deviceId}/measurements`,
      { params: { page, size, sort } }
    );
    return res.data;
  },
};
