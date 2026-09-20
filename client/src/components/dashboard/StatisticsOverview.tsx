import React from 'react';
import type { DeviceStatisticsResponse } from '../../types/api';

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
          <p className="error-state-text">{error}</p>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
            Retry Statistics
          </button>
        </div>
      </section>
    );
  }

  const hasActivity = statistics && statistics.totalSittingMinutes > 0;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-title">Today's Overview</div>
        {statistics?.date && (
          <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
            {statistics.date}
          </span>
        )}
      </div>

      {!hasActivity && (
        <div style={{ padding: '12px 16px', background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', fontSize: '0.8125rem', color: '#8b949e', marginBottom: '16px' }}>
          No sitting activity recorded today.
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
            {statistics ? `${statistics.totalSittingMinutes} total min` : 'No data'}
          </div>
        </div>

        {/* Average Posture Score */}
        <div className="stat-card">
          <div className="stat-card-label">Average Posture Score</div>
          <div className="stat-card-value">
            {statistics && statistics.averagePostureScore !== null && statistics.averagePostureScore !== undefined
              ? `${Math.round(statistics.averagePostureScore)} / 100`
              : '—'}
          </div>
          <div className="stat-card-subtext">
            {statistics && statistics.averagePostureScore >= 80
              ? '● Excellent alignment'
              : statistics && statistics.averagePostureScore >= 60
                ? '● Moderate alignment'
                : statistics
                  ? '● Needs attention'
                  : 'No data'}
          </div>
        </div>

        {/* Good Posture */}
        <div className="stat-card">
          <div className="stat-card-label">Good Posture</div>
          <div className="stat-card-value" style={{ color: '#3fb950' }}>
            {statistics ? formatMinutes(statistics.goodPostureMinutes) : '—'}
          </div>
          <div className="stat-card-subtext">
            {statistics ? `Poor: ${formatMinutes(statistics.poorPostureMinutes)}` : 'No data'}
          </div>
        </div>

        {/* Total Sessions */}
        <div className="stat-card">
          <div className="stat-card-label">Sitting Sessions</div>
          <div className="stat-card-value">
            {statistics ? statistics.totalSessionsCount : '—'}
          </div>
          <div className="stat-card-subtext">Recorded today</div>
        </div>
      </div>
    </section>
  );
};
