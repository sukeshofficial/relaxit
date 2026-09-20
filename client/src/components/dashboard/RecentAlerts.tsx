import React, { useState } from 'react';
import type { AlertResponse } from '../../types/api';
import { alertApi } from '../../api/alert.api';
import { Icon } from '../ui/Icon';

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
        <div className="dashboard-card-title">
          <Icon name="alerts" size={18} />
          <span>Recent Alerts</span>
        </div>
        <div className="error-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <div className="error-state-left">
            <Icon name="error" size={18} />
            <span>{error}</span>
          </div>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
            Retry Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <Icon name="alerts" size={18} />
          <span>Recent Alerts</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            backgroundColor: 'var(--color-primary-soft)',
            border: '1px solid var(--color-primary-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-primary-dark)',
            fontSize: '0.875rem',
            textAlign: 'center',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check-circle" size={18} />
          <span>You're all clear. No pending posture warnings.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map((alert) => {
            const isAck = !!alert.acknowledgedAt;
            return (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-surface-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{alert.type}</span>
                    <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {formatTime(alert.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.84rem' }}>
                    {alert.message}
                  </p>
                </div>

                {isAck ? (
                  <span className="status-badge offline" style={{ opacity: 0.8 }}>
                    ACKNOWLEDGED
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={ackIdLoading === alert.id}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78125rem' }}
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
