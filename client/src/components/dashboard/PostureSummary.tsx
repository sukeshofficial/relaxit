import React from 'react';
import type { PostureResponse, PostureType } from '../../types/api';
import { Icon } from '../ui/Icon';

interface PostureSummaryProps {
  postureList: PostureResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const SAMPLE_POSTURES: PostureResponse[] = [
  {
    id: 'sample-posture-1',
    deviceId: 'sample-dev',
    sessionId: 'sample-sess-1',
    postureType: 'GOOD',
    score: 95,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-posture-2',
    deviceId: 'sample-dev',
    sessionId: 'sample-sess-1',
    postureType: 'SLOUCHING',
    score: 68,
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-posture-3',
    deviceId: 'sample-dev',
    sessionId: 'sample-sess-1',
    postureType: 'GOOD',
    score: 92,
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-posture-4',
    deviceId: 'sample-dev',
    sessionId: 'sample-sess-1',
    postureType: 'LEAN_RIGHT',
    score: 74,
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
];

export const PostureSummary: React.FC<PostureSummaryProps> = ({
  postureList,
  isLoading,
  error,
}) => {
  const getPostureBadge = (type: PostureType) => {
    switch (type) {
      case 'GOOD':
        return { label: 'GOOD', badgeClass: 'status-badge online' };
      case 'SLOUCHING':
        return { label: 'SLOUCHING', badgeClass: 'status-badge inactive' };
      case 'LEAN_LEFT':
        return { label: 'LEAN LEFT', badgeClass: 'status-badge offline' };
      case 'LEAN_RIGHT':
        return { label: 'LEAN RIGHT', badgeClass: 'status-badge offline' };
      case 'FORWARD_LEAN':
        return { label: 'FORWARD LEAN', badgeClass: 'status-badge inactive' };
      case 'PROLONGED_POOR_POSTURE':
        return { label: 'POOR POSTURE', badgeClass: 'status-badge offline' };
      default:
        return { label: String(type), badgeClass: 'status-badge offline' };
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
        <div className="skeleton-box" style={{ width: '100%', height: '60px', marginBottom: '16px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '32px' }} />
      </div>
    );
  }

  const displayList = postureList.length > 0 ? postureList : SAMPLE_POSTURES;
  const isSample = postureList.length === 0 || !!error;

  const latest = displayList[0];
  const recentTimeline = displayList.slice(0, 5);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <Icon name="activity" size={18} />
          <span>Posture Alignment</span>
        </div>
        {isSample ? (
          <span className="status-badge offline" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>SAMPLE TELEMETRY</span>
        ) : (
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
            Last: {formatTime(latest.timestamp)}
          </span>
        )}
      </div>

      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--color-surface-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Current Alignment</div>
          {(() => {
            const badge = getPostureBadge(latest.postureType);
            return <span className={badge.badgeClass}>{badge.label}</span>;
          })()}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', marginBottom: '2px', fontWeight: 600 }}>Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{latest.score}</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Recent Telemetry Sequence
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentTimeline.map((item) => {
            const badge = getPostureBadge(item.postureType);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-surface-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.78125rem' }}>
                  {formatTime(item.timestamp)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={badge.badgeClass}>{badge.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{item.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
