import React from 'react';
import type { DeviceEventResponse } from '../../types/api';

interface RecentActivityProps {
  events: DeviceEventResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  events,
  isLoading,
  error,
  onRetry,
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

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="section-title">Device Activity</div>
        <div className="error-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <p className="error-state-text">{error}</p>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
            Retry Activity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="section-title">Device Activity</div>

      {events.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <p className="empty-state-text">
            No recent activity events logged for this device.
          </p>
        </div>
      ) : (
        <div className="timeline-list">
          {events.map((evt) => (
            <div key={evt.id} className="timeline-item">
              <div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>{evt.eventType}</div>
                {evt.details && (
                  <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '2px' }}>
                    {evt.details}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
                {formatTime(evt.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
