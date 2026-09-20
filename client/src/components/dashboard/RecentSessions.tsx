import React from 'react';
import type { SessionResponse } from '../../types/api';

interface RecentSessionsProps {
  sessions: SessionResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  sessions,
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

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="section-title">Today's Sessions</div>
        <div className="error-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <p className="error-state-text">{error}</p>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
            Retry Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="section-title">Today's Sessions</div>

      {sessions.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <p className="empty-state-text">
            Your first sitting session will appear here once Relaxit detects you sitting.
          </p>
        </div>
      ) : (
        <div className="timeline-list">
          {sessions.map((session) => (
            <div key={session.id} className="timeline-item">
              <div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>
                  {formatTime(session.startedAt)}
                  {session.endedAt ? ` — ${formatTime(session.endedAt)}` : ' (Active)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '2px' }}>
                  Duration: {formatDuration(session.durationSeconds)}
                </div>
              </div>

              <span
                className={
                  session.status === 'COMPLETED'
                    ? 'badge-good'
                    : session.status === 'ACTIVE'
                      ? 'badge-info'
                      : 'badge-warning'
                }
              >
                {session.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
