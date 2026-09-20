import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse, DeviceStatusResponse } from '../../types/api';
import axios from 'axios';

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/auth.api';
import DeviceStatusBadge from '../../components/devices/DeviceStatusBadge';
import RenameDeviceDialog from '../../components/devices/RenameDeviceDialog';
import ProvisionDeviceDialog from '../../components/devices/ProvisionDeviceDialog';
import UnpairDeviceDialog from '../../components/devices/UnpairDeviceDialog';
import { simulationService } from '../../services/simulation.service';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

export default function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      navigate('/login');
    }
  };

  const [device, setDevice] = useState<DeviceResponse | null>(null);
  const [statusInfo, setStatusInfo] = useState<DeviceStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isUnpairOpen, setIsUnpairOpen] = useState(false);

  // Virtual Device Simulator State
  const [simStatus, setSimStatus] = useState<any>({ running: false });
  const [simSecretInput, setSimSecretInput] = useState('');
  const [isStartingSim, setIsStartingSim] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('NORMAL_SITTING');
  const [selectedSpeed, setSelectedSpeed] = useState(1);

  const refreshSimStatus = useCallback(async () => {
    const status = await simulationService.getStatus();
    setSimStatus(status);
    if (status.scenario) setSelectedScenario(status.scenario);
    if (status.speedMultiplier) setSelectedSpeed(status.speedMultiplier);
  }, []);

  useEffect(() => {
    refreshSimStatus();
    const interval = setInterval(refreshSimStatus, 2000);
    return () => clearInterval(interval);
  }, [refreshSimStatus]);

  const handleRunDevice = async () => {
    if (!device?.id) return;
    setIsStartingSim(true);
    try {
      if (simSecretInput.trim()) {
        await simulationService.startDevice(device.id, simSecretInput);
      } else {
        await simulationService.autoStartDevice(device.id);
      }
      await refreshSimStatus();
      await fetchDeviceData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start device runner.');
    } finally {
      setIsStartingSim(false);
    }
  };

  const handleStopDevice = async () => {
    try {
      await simulationService.stopDevice();
      await refreshSimStatus();
      await fetchDeviceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScenarioChange = async (newScenario: string) => {
    setSelectedScenario(newScenario);
    if (simStatus.running) {
      await simulationService.setScenario(newScenario);
      await refreshSimStatus();
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSelectedSpeed(newSpeed);
    if (simStatus.running) {
      await simulationService.setSpeed(newSpeed);
      await refreshSimStatus();
    }
  };

  const fetchDeviceData = useCallback(async () => {
    if (!deviceId) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Parallel fetch of device metadata and operational status
      const [deviceRes, statusRes] = await Promise.allSettled([
        deviceApi.getDevice(deviceId),
        deviceApi.getDeviceStatus(deviceId),
      ]);

      if (deviceRes.status === 'fulfilled' && deviceRes.value) {
        const val = deviceRes.value;
        const fetchedDevice = ('data' in val && val.data) ? val.data : (val as unknown as DeviceResponse);
        if (fetchedDevice && (fetchedDevice.id || fetchedDevice.deviceIdentifier)) {
          setDevice(fetchedDevice);
        } else {
          setErrorMsg('Failed to load device information.');
        }
      } else {
        if (deviceRes.status === 'rejected' && axios.isAxiosError(deviceRes.reason)) {
          const status = deviceRes.reason.response?.status;
          if (status === 404 || status === 403) {
            setErrorMsg('Device not found or you do not have permission to access it.');
            setIsLoading(false);
            return;
          }
        }
        setErrorMsg('Failed to load device information.');
      }

      if (statusRes.status === 'fulfilled' && statusRes.value) {
        const val = statusRes.value;
        const fetchedStatus = ('data' in val && val.data) ? val.data : (val as unknown as DeviceStatusResponse);
        if (fetchedStatus) {
          setStatusInfo(fetchedStatus);
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred while loading device details.');
    } finally {
      setIsLoading(false);
    }

  }, [deviceId]);

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  const handleDeviceUpdated = (updated: DeviceResponse) => {
    setDevice(updated);
  };

  const handleUnpairSuccess = () => {
    navigate('/devices', { replace: true });
  };

  return (
    <div className="devices-page" style={{ padding: 0 }}>
      <DashboardHeader
        userFirstName={user?.fullName || user?.email}
        onLogout={handleLogout}
        activeNav="devices"
      />
      <div className="devices-container" style={{ padding: '24px', boxSizing: 'border-box' }}>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/devices">&larr; Back to Devices</Link>
          <span>/</span>
          <span>{device?.name || 'Device Details'}</span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="detail-header" style={{ flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton-box" style={{ width: '40%', height: '28px' }} />
            <div className="skeleton-box" style={{ width: '25%', height: '20px' }} />
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <div className="error-state">
            <h3 className="error-state-title">Device Unavailable</h3>
            <p className="error-state-text">{errorMsg}</p>
            <button className="btn-secondary" onClick={() => navigate('/devices')}>
              Return to Devices List
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !errorMsg && device && (
          <>
            {/* Main Info Header */}
            <div className="detail-header">
              <div>
                <h1 className="detail-title">{device.name}</h1>
                <span className="detail-identifier">{device.deviceIdentifier}</span>
              </div>
              <div>
                <DeviceStatusBadge status={statusInfo?.status || device.status} />
              </div>
            </div>

            {/* Overview Grids */}
            <div className="detail-grid">
              {/* Card 1: Operational Status */}
              <div className="detail-card">
                <h3 className="detail-card-title">Operational Status</h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-item-label">Status</span>
                    <span className="detail-item-value">
                      <DeviceStatusBadge status={statusInfo?.status || device.status} />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-item-label">Last Seen</span>
                    <span className="detail-item-value">
                      {formatDate(statusInfo?.lastSeenAt || device.lastSeenAt)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-item-label">Firmware</span>
                    <span className="detail-item-value">
                      {statusInfo?.firmwareVersion || device.firmwareVersion || 'v1.0.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Device Information */}
              <div className="detail-card">
                <h3 className="detail-card-title">Device Metadata</h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-item-label">Device ID</span>
                    <span className="detail-item-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {device.id}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-item-label">Paired Date</span>
                    <span className="detail-item-value">{formatDate(device.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-item-label">Last Modified</span>
                    <span className="detail-item-value">{formatDate(device.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Device Simulator Card */}
            <div className="detail-card" style={{ marginBottom: '24px', borderLeft: simStatus.running ? '4px solid #10b981' : '4px solid #6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="detail-card-title" style={{ margin: 0 }}>Virtual Device Runner</h3>
                <span className={`status-badge ${simStatus.running ? 'status-online' : 'status-offline'}`}>
                  ● {simStatus.running ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>

              <div className="detail-list" style={{ marginTop: '16px' }}>
                {!simStatus.running ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                      Run a virtual Relaxit device to generate realistic sensor telemetry and process sessions/posture in real-time.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="password"
                        placeholder="Device Secret (Optional - Auto-filled if blank)"
                        className="form-input"
                        style={{ maxWidth: '340px' }}
                        value={simSecretInput}
                        onChange={(e) => setSimSecretInput(e.target.value)}
                      />
                      <button
                        className="btn-primary"
                        onClick={handleRunDevice}
                        disabled={isStartingSim}
                      >
                        {isStartingSim ? 'Starting...' : 'Run Device'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>Scenario</span>
                        <select
                          className="form-input"
                          value={selectedScenario}
                          onChange={(e) => handleScenarioChange(e.target.value)}
                          style={{ marginTop: '4px', padding: '6px 12px' }}
                        >
                          <option value="NORMAL_SITTING">Normal Sitting</option>
                          <option value="LEAN_LEFT">Lean Left</option>
                          <option value="LEAN_RIGHT">Lean Right</option>
                          <option value="FORWARD_LEAN">Forward Lean</option>
                          <option value="SLOUCHING">Slouching</option>
                          <option value="FREQUENT_MOVEMENT">Frequent Movement</option>
                          <option value="PROLONGED_POOR_POSTURE">Prolonged Poor Posture</option>
                          <option value="USER_LEAVES">User Leaves</option>
                          <option value="LOW_BATTERY">Low Battery</option>
                          <option value="LONG_RUN">Long Run Scenario</option>
                        </select>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>Time Speed</span>
                        <select
                          className="form-input"
                          value={selectedSpeed}
                          onChange={(e) => handleSpeedChange(Number(e.target.value))}
                          style={{ marginTop: '4px', padding: '6px 12px' }}
                        >
                          <option value={1}>1x (Real-time)</option>
                          <option value={2}>2x</option>
                          <option value={10}>10x</option>
                          <option value={60}>60x</option>
                        </select>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>Battery</span>
                        <span style={{ fontWeight: 600, marginTop: '8px', display: 'block' }}>{simStatus.batteryLevel}%</span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>Temperature</span>
                        <span style={{ fontWeight: 600, marginTop: '8px', display: 'block' }}>{simStatus.temperature} °C</span>
                      </div>
                    </div>

                    <div>
                      <button className="btn-danger" onClick={handleStopDevice}>
                        Stop Device
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="detail-actions-card">
              <h3 className="detail-card-title">Device Management Actions</h3>
              <div className="detail-actions-list">
                <button className="btn-secondary" onClick={() => setIsRenameOpen(true)}>
                  &#9998; Rename Device
                </button>
                <button className="btn-primary" onClick={() => setIsProvisionOpen(true)}>
                  &#128273; Provision Device Secret
                </button>
                <button className="btn-danger" onClick={() => setIsUnpairOpen(true)}>
                  &#128465; Unpair Device
                </button>
              </div>
            </div>

            {/* Dialogs */}
            <RenameDeviceDialog
              isOpen={isRenameOpen}
              device={device}
              onClose={() => setIsRenameOpen(false)}
              onSuccess={handleDeviceUpdated}
            />

            <ProvisionDeviceDialog
              isOpen={isProvisionOpen}
              device={device}
              onClose={() => setIsProvisionOpen(false)}
            />

            <UnpairDeviceDialog
              isOpen={isUnpairOpen}
              device={device}
              onClose={() => setIsUnpairOpen(false)}
              onSuccess={handleUnpairSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
}
