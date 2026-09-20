import React from 'react';
import type { SessionResponse } from '../../types/api';
import { Icon } from '../ui/Icon';

interface RecentSessionsProps {
  sessions: SessionResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const SAMPLE_SESSIONS: SessionResponse[] = [
  {
    id: 'sample-session-1',
    deviceId: 'sample-dev',
    startedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    durationSeconds: 7200,
    status: 'COMPLETED',
  },
  {
    id: 'sample-session-2',
    deviceId: 'sample-dev',
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    endedAt: null,
    durationSeconds: 900,
    status: 'ACTIVE',
  },
];

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  sessions,
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

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0 min';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
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

  const displaySessions = sessions.length > 0 ? sessions : SAMPLE_SESSIONS;
  const isSample = sessions.length === 0 || !!error;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <Icon name="clock" size={18} />
          <span>Today's Sessions</span>
        </div>
        {isSample && (
          <span className="status-badge offline" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>SAMPLE DATA</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displaySessions.map((session) => (
          <div
            key={session.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'var(--color-surface-primary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>
                {formatTime(session.startedAt)}
                {session.endedAt ? ` — ${formatTime(session.endedAt)}` : ' (Active)'}
              </div>
              <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
                Duration: {formatDuration(session.durationSeconds)}
              </div>
            </div>

            <span
              className={
                session.status === 'COMPLETED'
                  ? 'status-badge online'
                  : session.status === 'ACTIVE'
                    ? 'status-badge online'
                    : 'status-badge inactive'
              }
            >
              {session.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
