import { useState, type FormEvent } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';
import { Icon } from '../ui/Icon';
import axios from 'axios';

interface RenameDeviceDialogProps {
  isOpen: boolean;
  device: DeviceResponse;
  onClose: () => void;
  onSuccess: (updatedDevice: DeviceResponse) => void;
}

export default function RenameDeviceDialog({
  isOpen,
  device,
  onClose,
  onSuccess,
}: RenameDeviceDialogProps) {
  const [name, setName] = useState(device.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMsg('Device Name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await deviceApi.updateDevice(device.id, { name: trimmedName });
      const updatedDev = res && ('data' in res && res.data) ? res.data : (res as unknown as DeviceResponse);
      if (updatedDev && (updatedDev.id || updatedDev.deviceIdentifier)) {
        onSuccess(updatedDev);
        onClose();
      } else {
        setErrorMsg(res?.message || 'Failed to rename device.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorMsg(err.response.data?.message || 'Failed to update device name.');
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
            <Icon name="edit" size={20} style={{ color: 'var(--color-primary)' }} />
            <h2 className="modal-title">Rename Device</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div className="alert-box alert-error" style={{ marginBottom: '16px' }}>
                <Icon name="error" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="editDeviceName">
                Device Name
              </label>
              <input
                id="editDeviceName"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
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
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Name'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
