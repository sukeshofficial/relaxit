export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'INACTIVE';

export interface CreateDeviceRequest {
  deviceIdentifier: string;
  name: string;
}

export interface UpdateDeviceRequest {
  name: string;
}

export interface DeviceResponse {
  id: string;
  deviceIdentifier: string;
  name: string;
  status: DeviceStatus;
  firmwareVersion: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProvisionDeviceResponse {
  deviceIdentifier: string;
  deviceSecret: string;
  provisionedAt: string;
}

export interface DeviceStatusResponse {
  deviceId: string;
  status: DeviceStatus;
  lastSeenAt: string | null;
  firmwareVersion: string | null;
}

