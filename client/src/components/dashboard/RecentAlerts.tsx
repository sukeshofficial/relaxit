import React, { useState } from 'react';
import type { AlertResponse } from '../../types/api';
import { alertApi } from '../../api/alert.api';

interface RecentAlertsProps {
  alerts: AlertResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onAlertAcknowledged: (alertId: string) => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  isLoading,
  error,
  onRetry,
  onAlertAcknowledged,
}) => {
  const [ackIdLoading, setAckIdLoading] = useState<string | null>(null);

  const handleAcknowledge = async (alertId: string) => {
    setAckIdLoading(alertId);
    try {
      await alertApi.acknowledgeAlert(alertId);
      onAlertAcknowledged(alertId);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setAckIdLoading(null);
    }
  };

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
        <div className="section-title">Recent Alerts</div>
        <div className="error-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <p className="error-state-text">{error}</p>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
            Retry Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="section-title">Recent Alerts</div>

      {alerts.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            backgroundColor: 'rgba(46, 160, 67, 0.1)',
            border: '1px solid rgba(46, 160, 67, 0.2)',
            borderRadius: '8px',
            color: '#3fb950',
            fontSize: '0.875rem',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          ✓ You're all clear. No pending warnings.
        </div>
      ) : (
        <div className="timeline-list">
          {alerts.map((alert) => {
            const isAck = !!alert.acknowledgedAt;
            return (
              <div
                key={alert.id}
                className="timeline-item"
                style={{ flexDirection: 'row', alignItems: 'flex-start' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>{alert.type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
                      {formatTime(alert.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#8b949e', fontSize: '0.8125rem' }}>
                    {alert.message}
                  </p>
                </div>

                {isAck ? (
                  <span className="badge-info" style={{ opacity: 0.7 }}>
                    ACKNOWLEDGED
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={ackIdLoading === alert.id}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {ackIdLoading === alert.id ? 'Saving...' : 'Acknowledge'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
