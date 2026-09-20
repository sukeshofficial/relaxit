import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoAsset from '../../assets/wordmark.svg';
import type { DeviceResponse, DeviceStatus } from '../../types/api';

interface DashboardHeaderProps {
  userFirstName?: string;
  devices?: DeviceResponse[];
  selectedDevice?: DeviceResponse | null;
  onSelectDevice?: (device: DeviceResponse) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLogout?: () => void;
  activeNav?: 'dashboard' | 'devices' | 'details';
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userFirstName,
  devices = [],
  selectedDevice,
  onSelectDevice,
  onRefresh,
  isRefreshing,
  onLogout,
  activeNav = 'dashboard',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentNav = activeNav || (location.pathname.startsWith('/devices') ? 'devices' : 'dashboard');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderStatusBadge = (status?: DeviceStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="status-badge online">
            <span className="status-badge-dot" />
            ONLINE
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="status-badge offline">
            <span className="status-badge-dot" />
            OFFLINE
          </span>
        );
      case 'INACTIVE':
      default:
        return (
          <span className="status-badge inactive">
            <span className="status-badge-dot" />
            INACTIVE
          </span>
        );
    }
  };

  return (
    <header className="dashboard-header-bar">
      <div className="dashboard-header-content">
        {/* Left branding & Greeting */}
        <div className="dashboard-header-brand">
          <img
            src={logoAsset}
            alt="Relaxit"
            className="dashboard-logo"
            onClick={() => navigate('/dashboard')}
          />
          <div className="dashboard-divider" />
          <p className="dashboard-greeting">
            {getGreeting()},{' '}
            <strong>{userFirstName || 'there'}</strong>
          </p>
        </div>

        {/* Right actions: Selector, Navigation links, Refresh & Sign Out */}
        <div className="dashboard-header-controls">
          {devices.length > 1 && onSelectDevice ? (
            <select
              value={selectedDevice?.id || ''}
              onChange={(e) => {
                const target = devices.find((d) => d.id === e.target.value);
                if (target) onSelectDevice(target);
              }}
              className="device-select-input"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          ) : selectedDevice ? (
            <div className="detail-identifier" style={{ fontSize: '0.8125rem' }}>
              {selectedDevice.name}
            </div>
          ) : null}

          {selectedDevice && renderStatusBadge(selectedDevice.status)}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh dashboard data"
              className="btn-icon"
            >
              <svg
                style={{
                  width: '16px',
                  height: '16px',
                  animation: isRefreshing ? 'skeleton-shimmer 1s linear infinite' : 'none',
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {/* Navigation Links */}
          <button
            onClick={() => navigate('/dashboard')}
            className={`btn-secondary ${currentNav === 'dashboard' ? 'active' : ''}`}
            style={{
              fontSize: '0.8125rem',
              padding: '6px 12px',
              backgroundColor: currentNav === 'dashboard' ? '#21262d' : undefined,
              borderColor: currentNav === 'dashboard' ? '#58a6ff' : undefined,
              color: currentNav === 'dashboard' ? '#58a6ff' : undefined,
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/devices')}
            className={`btn-secondary ${currentNav === 'devices' ? 'active' : ''}`}
            style={{
              fontSize: '0.8125rem',
              padding: '6px 12px',
              backgroundColor: currentNav === 'devices' ? '#21262d' : undefined,
              borderColor: currentNav === 'devices' ? '#58a6ff' : undefined,
              color: currentNav === 'devices' ? '#58a6ff' : undefined,
            }}
          >
            Device Management
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '6px 12px', color: '#f85149', borderColor: '#30363d' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


