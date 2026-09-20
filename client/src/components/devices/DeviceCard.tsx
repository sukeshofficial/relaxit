import { Link } from 'react-router-dom';
import type { DeviceResponse } from '../../types/api';
import DeviceStatusBadge from './DeviceStatusBadge';

interface DeviceCardProps {
  device: DeviceResponse;
}

function formatLastSeen(lastSeenAt: string | null): string {
  if (!lastSeenAt) return 'Never';
  try {
    const date = new Date(lastSeenAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return lastSeenAt;
  }
}

export default function DeviceCard({ device }: DeviceCardProps) {
  return (
    <div className="device-card">
      <div className="device-card-header">
        <div>
          <h3 className="device-card-name">{device.name}</h3>
          <span className="device-card-identifier">{device.deviceIdentifier}</span>
        </div>
        <DeviceStatusBadge status={device.status} />
      </div>

      <div className="device-card-meta">
        <div className="device-card-meta-row">
          <span>Firmware</span>
          <span>{device.firmwareVersion || 'v1.0.0'}</span>
        </div>
        <div className="device-card-meta-row">
          <span>Last seen</span>
          <span>{formatLastSeen(device.lastSeenAt)}</span>
        </div>
      </div>

      <div className="device-card-footer">
        <Link to={`/devices/${device.id}`} className="device-card-link">
          View Device &rarr;
        </Link>
      </div>
    </div>
  );
}
