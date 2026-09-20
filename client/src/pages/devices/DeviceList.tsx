import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../../api/auth.api';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';
import axios from 'axios';

import DeviceCard from '../../components/devices/DeviceCard';
import AddDeviceDialog from '../../components/devices/AddDeviceDialog';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../../components/ui/Icon';
import '../../styles/devices.css';

export default function DeviceList() {
  const { user } = useAuth();

  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const list = await deviceApi.getDevices();
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
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDeviceAdded = (newDevice: DeviceResponse) => {
    setDevices((prev) => [newDevice, ...prev]);
    setErrorMsg(null);
  };

  return (
    <div className="devices-page" style={{ padding: 0 }}>
      <DashboardHeader
        userFirstName={user?.fullName || user?.email}
        onLogout={handleLogout}
        activeNav="devices"
      />
      <div className="devices-container">
        {/* Toolbar */}
        <div className="devices-toolbar">
          <div className="devices-title-area">
            <h1>My Relaxit Devices</h1>
            <p>Manage and monitor your paired physical Relaxit Smart Backrests.</p>
          </div>

          <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
            <Icon name="plus" size={16} />
            <span>Pair New Device</span>
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
            <div className="error-state-left">
              <Icon name="error" size={20} />
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--color-error)' }}>Failed to Load Devices</h3>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{errorMsg}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={fetchDevices}>
                Retry
              </button>
              <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
                + Pair Device
              </button>
            </div>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !errorMsg && (
          <>
            {devices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Icon name="backrest" size={32} />
                </div>
                <h3 className="empty-state-title">No Relaxit devices paired</h3>
                <p className="empty-state-text">
                  Pair your Relaxit smart backrest to start tracking posture alignment, sitting sessions, and ergonomics.
                </p>
                <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
                  <Icon name="plus" size={16} />
                  <span>Pair First Device</span>
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
