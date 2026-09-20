import { useState } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';
import { Icon } from '../ui/Icon';
import axios from 'axios';

interface UnpairDeviceDialogProps {
  isOpen: boolean;
  device: DeviceResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UnpairDeviceDialog({
  isOpen,
  device,
  onClose,
  onSuccess,
}: UnpairDeviceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnpair = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await deviceApi.deleteDevice(device.id);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorMsg(err.response.data?.message || 'Failed to unpair device.');
      } else {
        setErrorMsg('Network error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Icon name="trash" size={20} style={{ color: 'var(--color-error)' }} />
            <h2 className="modal-title" style={{ color: 'var(--color-error)' }}>
              Unpair Device
            </h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div className="alert-box alert-error" style={{ marginBottom: '16px' }}>
              <Icon name="error" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Are you sure you want to unpair <strong>{device.name}</strong> (
            <code style={{ color: 'var(--color-primary-dark)' }}>{device.deviceIdentifier}</code>)?
          </p>

          <div className="alert-box alert-error">
            <Icon name="alert-triangle" size={18} />
            <span>This action will remove the device from your account. You will need to pair it again to resume session tracking.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleUnpair}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Unpairing...' : 'Confirm Unpair'}
          </button>
        </div>
      </div>
    </div>
  );
}
