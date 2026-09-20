import { apiClient } from './client';
import { authStore } from '../store/authStore';
import type {
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LogoutRequest,
} from '../types/api';

export const authApi = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return res.data;
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    if (res.data.success && res.data.data) {
      const { user, accessToken, refreshToken } = res.data.data;
      authStore.setAuthSession(user, accessToken, refreshToken);
    }
    return res.data;
  },

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RegisterResponse>> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/refresh-token', data);
    if (res.data.success && res.data.data) {
      const { user, accessToken, refreshToken } = res.data.data;
      authStore.setAuthSession(user, accessToken, refreshToken);
    }
    return res.data;
  },

  async logout(data?: LogoutRequest): Promise<ApiResponse<void>> {
    try {
      const res = await apiClient.post<ApiResponse<void>>('/auth/logout', data || {});
      return res.data;
    } finally {
      authStore.clearAuth();
    }
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<void>> {
    const res = await apiClient.post<ApiResponse<void>>('/auth/verify-email', data);
    return res.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    const res = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', data);
    return res.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const res = await apiClient.post<ApiResponse<void>>('/auth/reset-password', data);
    return res.data;
  },
};
