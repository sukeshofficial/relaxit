import { apiClient } from './client';
import { authStore } from '../store/authStore';
import type {
  ApiResponse,
  AuthUserResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../types/api';

export const userApi = {
  async getCurrentUser(): Promise<ApiResponse<AuthUserResponse>> {
    const res = await apiClient.get<ApiResponse<AuthUserResponse>>('/users/me');
    if (res.data.success && res.data.data) {
      authStore.setUser(res.data.data);
    }
    return res.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<AuthUserResponse>> {
    const res = await apiClient.put<ApiResponse<AuthUserResponse>>('/users/me', data);
    if (res.data.success && res.data.data) {
      authStore.setUser(res.data.data);
    }
    return res.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const res = await apiClient.put<ApiResponse<void>>('/users/me/password', data);
    return res.data;
  },

  async deleteAccount(): Promise<ApiResponse<void>> {
    try {
      const res = await apiClient.delete<ApiResponse<void>>('/users/me');
      return res.data;
    } finally {
      authStore.clearAuth();
    }
  },
};
