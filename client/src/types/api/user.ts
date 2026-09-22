export interface AuthUserResponse {
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
