import { useState } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';
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
          <h2 className="modal-title" style={{ color: '#ff7b72' }}>
            Unpair Device
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

          <p style={{ margin: '0 0 16px 0', color: '#c9d1d9', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Are you sure you want to unpair <strong>{device.name}</strong> (
            <code style={{ color: '#58a6ff' }}>{device.deviceIdentifier}</code>)?
          </p>

          <div
            style={{
              backgroundColor: 'rgba(218, 54, 51, 0.1)',
              border: '1px solid rgba(248, 81, 73, 0.3)',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '0.84rem',
              color: '#ff7b72',
              lineHeight: 1.4,
            }}
          >
            This action will remove the device from your account. You will need to pair it again to resume session tracking.
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
