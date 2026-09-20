import type { DeviceStatus } from '../../types/api';

interface DeviceStatusBadgeProps {
  status: DeviceStatus;
}

export default function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const statusLower = (status || 'OFFLINE').toLowerCase();

  return (
    <span className={`status-badge ${statusLower}`}>
      <span className="status-badge-dot" />
      {status || 'OFFLINE'}
    </span>
  );
}
