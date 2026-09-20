export interface SessionResponse {
  id: string;
  deviceId: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}

export type PostureType =
  | 'GOOD'
  | 'SLOUCHING'
  | 'LEAN_LEFT'
  | 'LEAN_RIGHT'
  | 'FORWARD_LEAN'
  | 'PROLONGED_POOR_POSTURE';

export interface PostureResponse {
  id: string;
  deviceId: string;
  sessionId: string;
  timestamp: string;
  postureType: PostureType;
  score: number;
}

export interface SensorMeasurementResponse {
  id: string;
  deviceId: string;
  sessionId: string;
  timestamp: string;
  sensorType: string;
  value: number;
  unit: string;
}

export interface DeviceEventResponse {
  id: string;
  deviceId: string;
  eventType: string;
  timestamp: string;
  details: string;
}

export interface AlertResponse {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  acknowledgedAt: string | null;
}

export interface DeviceStatisticsResponse {
  date: string;
  totalSittingMinutes: number;
  averagePostureScore: number;
  goodPostureMinutes: number;
  poorPostureMinutes: number;
  totalSessionsCount: number;
}

