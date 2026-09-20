import { useState, type FormEvent } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse } from '../../types/api';
import axios from 'axios';

interface AddDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDevice: DeviceResponse) => void;
}

export default function AddDeviceDialog({ isOpen, onClose, onSuccess }: AddDeviceDialogProps) {
  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedId = deviceIdentifier.trim();
    const trimmedName = name.trim();

    if (!trimmedId) {
      setErrorMsg('Device Identifier is required.');
      return;
    }
    if (!trimmedName) {
      setErrorMsg('Device Name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await deviceApi.createDevice({
        deviceIdentifier: trimmedId,
        name: trimmedName,
      });

      const createdDevice = res && ('data' in res && res.data) ? res.data : (res as unknown as DeviceResponse);

      if (createdDevice && (createdDevice.id || createdDevice.deviceIdentifier)) {
        setSuccessMsg('Device paired successfully!');
        setTimeout(() => {
          onSuccess(createdDevice);
          onClose();
          setDeviceIdentifier('');
          setName('');
          setSuccessMsg(null);
        }, 1000);
      } else {
        setErrorMsg(res?.message || 'Failed to create device.');
      }
    } catch (err: unknown) {

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setErrorMsg('This device is already paired or registered to an account.');
        } else {
          setErrorMsg(err.response.data?.message || 'Failed to add device. Please try again.');
        }
      } else {
        setErrorMsg('Network or unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Pair Relaxit Device</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}
            {successMsg && (
              <div className="alert-box" style={{ backgroundColor: '#1f482d', color: '#3fb950', border: '1px solid #238636', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
                ✓ {successMsg}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '16px' }}>

              <label className="form-label" htmlFor="deviceIdentifier">
                Device Identifier *
              </label>
              <input
                id="deviceIdentifier"
                type="text"
                className="form-input"
                placeholder="e.g. RELAXIT-DEV-001"
                value={deviceIdentifier}
                onChange={(e) => setDeviceIdentifier(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>
                Found on the device label or hardware box.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deviceName">
                Device Name *
              </label>
              <input
                id="deviceName"
                type="text"
                className="form-input"
                placeholder="e.g. Office Chair Backrest"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
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
              {isSubmitting ? 'Pairing...' : 'Pair Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
