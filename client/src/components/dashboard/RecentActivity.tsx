import React from 'react';
import type { DeviceEventResponse } from '../../types/api';
import { Icon } from '../ui/Icon';

interface RecentActivityProps {
  events: DeviceEventResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const SAMPLE_EVENTS: DeviceEventResponse[] = [
  {
    id: 'sample-evt-1',
    deviceId: 'sample-dev',
    eventType: 'DEVICE_CONNECTED',
    details: 'Hardware telemetry handshake established over secure WSS',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-evt-2',
    deviceId: 'sample-dev',
    eventType: 'CALIBRATION_COMPLETED',
    details: 'Pressure grid calibrated to user lumbar profile',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-evt-3',
    deviceId: 'sample-dev',
    eventType: 'FIRMWARE_CHECK',
    details: 'Firmware v1.0.4 active — battery level 92%',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = ({
  events,
  isLoading,
  error,
}) => {
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-card">
        <div className="skeleton-box" style={{ width: '40%', height: '18px', marginBottom: '16px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '40px', marginBottom: '8px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '40px' }} />
      </div>
    );
  }

  const displayEvents = events.length > 0 ? events : SAMPLE_EVENTS;
  const isSample = events.length === 0 || !!error;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <Icon name="cpu" size={18} />
          <span>Device Activity Log</span>
        </div>
        {isSample && (
          <span className="status-badge offline" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>SAMPLE LOGS</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {displayEvents.map((evt) => (
          <div
            key={evt.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: 'var(--color-surface-primary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>{evt.eventType}</div>
              {evt.details && (
                <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {evt.details}
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              {formatTime(evt.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
