import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';

import axios from 'axios';

import logoAsset from '../../assets/wordmark.svg';
import DeviceCard from '../../components/devices/DeviceCard';
import AddDeviceDialog from '../../components/devices/AddDeviceDialog';
import '../../styles/devices.css';

export default function DeviceList() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await deviceApi.getDevices();
      const list = res.data ?? (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        setDevices(list);
      } else {
        setErrorMsg('Failed to load devices.');
      }
    } catch (err: unknown) {


      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 403) {
          setErrorMsg('Authentication session required (403 Forbidden). Please sign out and sign in again.');
        } else {
          setErrorMsg(err.response.data?.message || `Server error (${err.response.status}). Please try again.`);
        }
      } else {
        setErrorMsg('Unable to connect to service. Please check your network and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeviceAdded = (newDevice: DeviceResponse) => {
    setDevices((prev) => [newDevice, ...prev]);
    setErrorMsg(null);
  };

  return (
    <div className="devices-page">
      <div className="devices-container">
        {/* App Header */}
        <header className="devices-header">
          <div className="devices-header-left">
            <img
              src={logoAsset}
              alt="Relaxit"
              className="devices-header-logo"
              onClick={() => navigate('/devices')}
            />
            <nav className="devices-nav">
              <span className="devices-nav-link active">My Devices</span>
              <span
                className="devices-nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </span>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-signout"
          >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </header>

        {/* Toolbar */}
        <div className="devices-toolbar">
          <div className="devices-title-area">
            <h1>My Relaxit Devices</h1>
            <p>Manage and monitor your paired physical Relaxit Smart Backrests.</p>
          </div>

          <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
            + Pair New Device
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="device-grid">
            <div className="skeleton-card">
              <div className="skeleton-box" style={{ width: '60%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '40%', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '100%', height: '32px', marginTop: 'auto' }} />
            </div>
            <div className="skeleton-card">
              <div className="skeleton-box" style={{ width: '50%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '35%', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '100%', height: '32px', marginTop: 'auto' }} />
            </div>
            <div className="skeleton-card">
              <div className="skeleton-box" style={{ width: '70%', height: '24px' }} />
              <div className="skeleton-box" style={{ width: '45%', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '100%', height: '32px', marginTop: 'auto' }} />
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <div className="error-state">
            <h3 className="error-state-title">Failed to Load Devices</h3>
            <p className="error-state-text">{errorMsg}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="btn-secondary" onClick={fetchDevices}>
                Retry
              </button>
              <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
                + Pair New Device Anyway
              </button>
            </div>
          </div>
        )}


        {/* Loaded Content */}
        {!isLoading && !errorMsg && (
          <>
            {devices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">&#128268;</div>
                <h3 className="empty-state-title">No Relaxit devices yet</h3>
                <p className="empty-state-text">
                  Connect your Relaxit backrest to start tracking your sitting sessions, posture, and wellness insights.
                </p>
                <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
                  Add Device
                </button>
              </div>
            ) : (
              <div className="device-grid">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Pair Dialog */}
      <AddDeviceDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleDeviceAdded}
      />
    </div>
  );
}
