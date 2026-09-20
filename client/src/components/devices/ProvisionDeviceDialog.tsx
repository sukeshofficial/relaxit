import { useState } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse, ProvisionDeviceResponse } from '../../types/api';
import axios from 'axios';

interface ProvisionDeviceDialogProps {
  isOpen: boolean;
  device: DeviceResponse;
  onClose: () => void;
}

export default function ProvisionDeviceDialog({
  isOpen,
  device,
  onClose,
}: ProvisionDeviceDialogProps) {
  const [step, setStep] = useState<'warning' | 'secret'>('warning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionData, setProvisionData] = useState<ProvisionDeviceResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleConfirmProvision = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await deviceApi.provisionDevice(device.id);
      const provData = res && ('data' in res && res.data) ? res.data : (res as unknown as ProvisionDeviceResponse);

      if (provData && (provData.deviceSecret || provData.deviceIdentifier)) {
        setProvisionData(provData);
        setStep('secret');
      } else {
        setErrorMsg(res?.message || 'Failed to provision device.');
      }
    } catch (err: unknown) {

      if (axios.isAxiosError(err) && err.response) {
        setErrorMsg(err.response.data?.message || 'Failed to provision device.');
      } else {
        setErrorMsg('Network error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySecret = async () => {
    if (!provisionData?.deviceSecret) return;
    try {
      await navigator.clipboard.writeText(provisionData.deviceSecret);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for clipboard
      const el = document.createElement('textarea');
      el.value = provisionData.deviceSecret;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCloseDialog = () => {
    setStep('warning');
    setProvisionData(null);
    setIsRevealed(false);
    setIsCopied(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCloseDialog}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Provision Relaxit Device</h2>
          <button className="modal-close" onClick={handleCloseDialog} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

          {step === 'warning' ? (
            <>
              <p style={{ margin: '0 0 16px 0', color: '#c9d1d9', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Provisioning will generate a unique <strong>Device Secret</strong> for physical device setup.
              </p>

              <div className="secret-warning">
                <strong>Important Security Warning:</strong>
                <br />
                Your device secret will only be shown <strong>ONCE</strong>. If you re-provision later, previous secrets will be invalidated.
              </div>

              <div className="detail-list" style={{ marginTop: '16px' }}>
                <div className="detail-item">
                  <span className="detail-item-label">Target Device</span>
                  <span className="detail-item-value">{device.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">Identifier</span>
                  <span className="detail-item-value" style={{ fontFamily: 'monospace', color: '#58a6ff' }}>
                    {device.deviceIdentifier}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="secret-warning">
                <strong>Save this secret now!</strong> It will not be displayed again after closing this window.
              </div>

              <div className="secret-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem', color: '#8b949e' }}>
                  <span>Device Secret</span>
                  <span>Provisioned: {provisionData ? new Date(provisionData.provisionedAt).toLocaleTimeString() : ''}</span>
                </div>

                <div className="secret-value">
                  {isRevealed
                    ? provisionData?.deviceSecret
                    : '••••••••••••••••••••••••••••••••'}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setIsRevealed(!isRevealed)}
                  >
                    {isRevealed ? 'Hide Secret' : 'Reveal Secret'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleCopySecret}
                  >
                    {isCopied ? 'Copied!' : 'Copy Secret'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {step === 'warning' ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmProvision}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Provisioning...' : 'Generate Device Secret'}
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" onClick={handleCloseDialog}>
              I Have Saved The Secret &mdash; Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
