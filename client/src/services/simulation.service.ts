import { apiClient } from '../api/client';

export interface SimulationStatus {
  running: boolean;
  deviceId?: string;
  deviceIdentifier?: string;
  scenario?: string;
  speedMultiplier?: number;
  simulatedTimestamp?: string;
  batteryLevel?: number;
  temperature?: number;
}

export const simulationService = {
  getStatus: async (): Promise<SimulationStatus> => {
    try {
      const response = await apiClient.get('/dev/simulation/status');
      return response.data;
    } catch {
      return { running: false };
    }
  },

  startDevice: async (deviceId: string, deviceSecret: string) => {
    const response = await apiClient.post('/dev/simulation/start', {
      deviceId,
      deviceSecret,
    });
    return response.data;
  },

  autoStartDevice: async (deviceId: string) => {
    const response = await apiClient.post('/dev/simulation/auto-start', {
      deviceId,
    });
    return response.data;
  },

  stopDevice: async () => {
    const response = await apiClient.post('/dev/simulation/stop', {});
    return response.data;
  },

  setScenario: async (scenario: string) => {
    const response = await apiClient.post('/dev/simulation/scenario', { scenario });
    return response.data;
  },

  setSpeed: async (multiplier: number) => {
    const response = await apiClient.post('/dev/simulation/speed', { multiplier });
    return response.data;
  },
};


