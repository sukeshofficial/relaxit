import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse, DeviceStatusResponse } from '../../types/api';
import axios from 'axios';

import logoAsset from '../../assets/wordmark.svg';
import DeviceStatusBadge from '../../components/devices/DeviceStatusBadge';
import RenameDeviceDialog from '../../components/devices/RenameDeviceDialog';
import ProvisionDeviceDialog from '../../components/devices/ProvisionDeviceDialog';
import UnpairDeviceDialog from '../../components/devices/UnpairDeviceDialog';
import '../../styles/devices.css';

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

  const [device, setDevice] = useState<DeviceResponse | null>(null);
  const [statusInfo, setStatusInfo] = useState<DeviceStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isUnpairOpen, setIsUnpairOpen] = useState(false);

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
              <span
                className="devices-nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/devices')}
              >
                My Devices
              </span>
              <span className="devices-nav-link active">Device Details</span>
            </nav>
          </div>
        </header>

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
