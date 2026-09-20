import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoAsset from '../../assets/wordmark.svg';
import { Icon } from '../ui/Icon';
import type { DeviceResponse, DeviceStatus } from '../../types/api';

interface DashboardHeaderProps {
  userFirstName?: string;
  devices?: DeviceResponse[];
  selectedDevice?: DeviceResponse | null;
  onSelectDevice?: (device: DeviceResponse) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLogout?: () => void;
  activeNav?: 'dashboard' | 'devices' | 'alerts' | 'settings';
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userFirstName,
  devices = [],
  selectedDevice,
  onSelectDevice,
  onRefresh,
  isRefreshing,
  onLogout,
  activeNav,
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
    <header className="app-header">
      <div className="app-header-container">
        {/* Brand Mark & Tagline */}
        <div className="app-header-left">
          <img
            src={logoAsset}
            alt="Relaxit"
            className="app-logo"
            onClick={() => navigate('/dashboard')}
          />
          <div className="app-header-divider" />
          <div className="app-header-greeting">
            <span className="greeting-text">{getGreeting()}, <strong>{userFirstName || 'there'}</strong> 👋</span>
            <span className="greeting-tagline">Sit Better &bull; Live Healthier</span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="app-header-nav">
          <button
            onClick={() => navigate('/dashboard')}
            className={`nav-tab ${currentNav === 'dashboard' ? 'active' : ''}`}
          >
            <Icon name="dashboard" size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/devices')}
            className={`nav-tab ${currentNav === 'devices' ? 'active' : ''}`}
          >
            <Icon name="devices" size={16} />
            <span>Devices</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="app-header-right">
          {devices.length > 1 && onSelectDevice ? (
            <div className="device-select-wrapper">
              <select
                value={selectedDevice?.id || ''}
                onChange={(e) => {
                  const target = devices.find((d) => d.id === e.target.value);
                  if (target) onSelectDevice(target);
                }}
                className="device-select-dropdown"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={14} className="select-arrow" />
            </div>
          ) : selectedDevice ? (
            <div className="selected-device-pill">
              <Icon name="backrest" size={14} />
              <span>{selectedDevice.name}</span>
            </div>
          ) : null}

          {selectedDevice && renderStatusBadge(selectedDevice.status)}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh telemetry"
              className="btn-icon-action"
            >
              <Icon
                name="refresh"
                size={16}
                className={isRefreshing ? 'spin-animation' : ''}
              />
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-signout-action"
              title="Sign Out"
            >
              <Icon name="logout" size={16} />
              <span className="signout-label">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
