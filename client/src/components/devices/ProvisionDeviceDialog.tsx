import { useState } from 'react';
import { deviceApi } from '../../api/device.api';
import type { DeviceResponse, ProvisionDeviceResponse } from '../../types/api';
import { Icon } from '../ui/Icon';
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
          <div className="modal-title-group">
            <Icon name="key" size={20} style={{ color: 'var(--color-primary)' }} />
            <h2 className="modal-title">Provision Relaxit Device</h2>
          </div>
          <button className="modal-close" onClick={handleCloseDialog} aria-label="Close dialog">
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

          {step === 'warning' ? (
            <>
              <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Provisioning will generate a unique <strong>Device Secret</strong> for physical device setup.
              </p>

              <div className="alert-box" style={{ backgroundColor: 'var(--color-warning-soft)', border: '1px solid var(--color-warning-border)', color: 'var(--color-warning)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem' }}>
                <Icon name="alert-triangle" size={18} />
                <div>
                  <strong>Important Security Warning:</strong>
                  <div style={{ marginTop: '4px' }}>
                    Your device secret will only be shown <strong>ONCE</strong>. If you re-provision later, previous secrets will be invalidated.
                  </div>
                </div>
              </div>

              <div className="detail-list" style={{ marginTop: '16px', background: 'var(--color-surface-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div className="detail-item">
                  <span className="detail-item-label">Target Device</span>
                  <span className="detail-item-value">{device.name}</span>
                </div>
                <div className="detail-item" style={{ marginTop: '8px' }}>
                  <span className="detail-item-label">Identifier</span>
                  <span className="detail-item-value" style={{ fontFamily: 'monospace', color: 'var(--color-primary-dark)' }}>
                    {device.deviceIdentifier}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="alert-box" style={{ backgroundColor: 'var(--color-warning-soft)', border: '1px solid var(--color-warning-border)', color: 'var(--color-warning)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', marginBottom: '16px' }}>
                <Icon name="check-circle" size={18} />
                <div>
                  <strong>Save this secret now!</strong> It will not be displayed again after closing this window.
                </div>
              </div>

              <div style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  <span>Device Secret</span>
                  <span>Provisioned: {provisionData ? new Date(provisionData.provisionedAt).toLocaleTimeString() : ''}</span>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-text-primary)', wordBreak: 'break-all', padding: '12px', background: 'var(--color-surface-primary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
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
