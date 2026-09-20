import React from 'react';
import type { DeviceStatisticsResponse } from '../../types/api';
import { Icon } from '../ui/Icon';

interface StatisticsOverviewProps {
  statistics: DeviceStatisticsResponse | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  statistics,
  isLoading,
  error,
  onRetry,
}) => {
  const formatMinutes = (minutes: number) => {
    if (minutes <= 0) return '0m';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <section>
        <div className="section-title">Today's Overview</div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="skeleton-card" style={{ height: '110px' }}>
              <div className="skeleton-box" style={{ width: '60%', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '40%', height: '24px' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="section-title">Today's Overview</div>
        <div className="error-state">
          <div className="error-state-left">
            <Icon name="error" size={18} />
            <span>{error}</span>
          </div>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
            Retry Statistics
          </button>
        </div>
      </section>
    );
  }

  const hasActivity = statistics && statistics.totalSittingMinutes > 0;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div className="section-title" style={{ margin: 0 }}>Today's Overview</div>
        {statistics?.date && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {statistics.date}
          </span>
        )}
      </div>

      {!hasActivity && (
        <div style={{ padding: '12px 16px', background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="info" size={16} />
          <span>No sitting activity recorded today yet. Start a session or run virtual telemetry.</span>
        </div>
      )}

      <div className="stats-grid">
        {/* Sitting Time */}
        <div className="stat-card">
          <div className="stat-card-label">Sitting Time</div>
          <div className="stat-card-value">
            {statistics ? formatMinutes(statistics.totalSittingMinutes) : '—'}
          </div>
          <div className="stat-card-subtext">
            <Icon name="clock" size={14} />
            <span>{statistics ? `${statistics.totalSittingMinutes} total min` : 'No data'}</span>
          </div>
        </div>

        {/* Average Posture Score */}
        <div className="stat-card">
          <div className="stat-card-label">Posture Score</div>
          <div className="stat-card-value" style={{ color: statistics && statistics.averagePostureScore >= 80 ? 'var(--color-primary)' : 'inherit' }}>
            {statistics && statistics.averagePostureScore !== null && statistics.averagePostureScore !== undefined
              ? `${Math.round(statistics.averagePostureScore)} / 100`
              : '—'}
          </div>
          <div className="stat-card-subtext">
            <Icon name="activity" size={14} />
            <span>
              {statistics && statistics.averagePostureScore >= 80
                ? 'Good posture alignment'
                : statistics && statistics.averagePostureScore >= 60
                  ? 'Moderate posture alignment'
                  : statistics
                    ? 'Needs ergonomic attention'
                    : 'No data'}
            </span>
          </div>
        </div>

        {/* Good Posture */}
        <div className="stat-card">
          <div className="stat-card-label">Good Posture</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            {statistics ? formatMinutes(statistics.goodPostureMinutes) : '—'}
          </div>
          <div className="stat-card-subtext">
            <Icon name="check-circle" size={14} />
            <span>{statistics ? `Poor: ${formatMinutes(statistics.poorPostureMinutes)}` : 'No data'}</span>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="stat-card">
          <div className="stat-card-label">Sitting Sessions</div>
          <div className="stat-card-value">
            {statistics ? statistics.totalSessionsCount : '—'}
          </div>
          <div className="stat-card-subtext">
            <Icon name="devices" size={14} />
            <span>Recorded today</span>
          </div>
        </div>
      </div>
    </section>
  );
};
