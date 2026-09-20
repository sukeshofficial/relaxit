import React from 'react';
import type { PostureResponse, PostureType } from '../../types/api';

interface PostureSummaryProps {
  postureList: PostureResponse[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const PostureSummary: React.FC<PostureSummaryProps> = ({
  postureList,
  isLoading,
  error,
  onRetry,
}) => {
  const getPostureBadge = (type: PostureType) => {
    switch (type) {
      case 'GOOD':
        return { label: 'GOOD', badgeClass: 'badge-good' };
      case 'SLOUCHING':
        return { label: 'SLOUCHING', badgeClass: 'badge-warning' };
      case 'LEAN_LEFT':
        return { label: 'LEAN LEFT', badgeClass: 'badge-info' };
      case 'LEAN_RIGHT':
        return { label: 'LEAN RIGHT', badgeClass: 'badge-info' };
      case 'FORWARD_LEAN':
        return { label: 'FORWARD LEAN', badgeClass: 'badge-warning' };
      case 'PROLONGED_POOR_POSTURE':
        return { label: 'POOR POSTURE', badgeClass: 'badge-danger' };
      default:
        return { label: String(type), badgeClass: 'badge-info' };
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

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="section-title">Posture Overview</div>
        <div className="error-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <p className="error-state-text">{error}</p>
          <button onClick={onRetry} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
            Retry Posture
          </button>
        </div>
      </div>
    );
  }

  const latest = postureList.length > 0 ? postureList[0] : null;
  const recentTimeline = postureList.slice(0, 5);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="section-title" style={{ margin: 0 }}>Posture Overview</div>
        {latest && (
          <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
            Last: {formatTime(latest.timestamp)}
          </span>
        )}
      </div>

      {latest ? (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '4px' }}>Current Status</div>
            {(() => {
              const badge = getPostureBadge(latest.postureType);
              return <span className={badge.badgeClass}>{badge.label}</span>;
            })()}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '4px' }}>Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>{latest.score}</div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px', backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', fontSize: '0.8125rem', color: '#8b949e', textAlign: 'center', marginBottom: '16px' }}>
          No posture records available today.
        </div>
      )}

      {recentTimeline.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>
            Recent History
          </div>
          <div className="timeline-list">
            {recentTimeline.map((item) => {
              const badge = getPostureBadge(item.postureType);
              return (
                <div key={item.id} className="timeline-item">
                  <span style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {formatTime(item.timestamp)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={badge.badgeClass}>{badge.label}</span>
                    <span style={{ fontWeight: 600, color: '#f0f6fc' }}>{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
