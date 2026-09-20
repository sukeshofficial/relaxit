export interface SessionResponse {
  id: number;
  deviceId: number;
  startTime: string;
  endTime: string | null;
  activeDurationSeconds: number;
  goodPostureSeconds: number;
  badPostureSeconds: number;
  averagePostureScore: number;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}

export interface PostureResponse {
  id: number;
  sessionId: number;
  postureStatus: 'GOOD' | 'SLOUCHING' | 'LEANING_LEFT' | 'LEANING_RIGHT' | 'UNKNOWN';
  postureScore: number;
  pressureDistribution: Record<string, number> | null;
  timestamp: string;
}

export interface SensorMeasurementResponse {
  id: number;
  sessionId: number;
  sensorIndex: number;
  rawValue: number;
  normalizedValue: number;
  timestamp: string;
}

export interface DeviceEventResponse {
  id: number;
  deviceId: number;
  eventType: string;
  eventSeverity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: Record<string, unknown> | null;
  timestamp: string;
}

export interface AlertResponse {
  id: number;
  deviceId: number;
  alertType: string;
  message: string;
  acknowledged: boolean;
  acknowledgedAt: string | null;
  createdAt: string;
}

export interface DeviceStatisticsResponse {
  deviceId: number;
  totalSessions: number;
  totalActiveTimeSeconds: number;
  totalGoodPostureSeconds: number;
  totalBadPostureSeconds: number;
  overallAverageScore: number;
  lastSessionAt: string | null;
}
