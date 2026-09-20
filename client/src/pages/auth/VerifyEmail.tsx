import { useState, useEffect, type FormEvent } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';
import { Icon } from '../../components/ui/Icon';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(
    (location.state as { message?: string })?.message || null
  );

  const handleVerify = async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) return;
    setStatus('loading');
    setMessage(null);

    try {
      const res = await authApi.verifyEmail({ token: tokenToVerify.trim() });
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully! You can now sign in to your Relaxit account.');
      } else {
        setStatus('error');
        setMessage(res.message || 'Email verification failed.');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setStatus('error');
      setMessage(
        axiosErr.response?.data?.message ||
        'Verification failed. The token may be invalid or expired.'
      );
    }
  };

  useEffect(() => {
    if (initialToken) {
      handleVerify(initialToken);
    }
  }, [initialToken]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleVerify(token);
  };

  return (
    <AuthLayout title="Verify Email" subtitle="Complete account verification to access Relaxit">
      {status === 'success' && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <Icon name="check-circle" size={18} />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="alert-box alert-error" style={{ marginBottom: '20px' }}>
          <Icon name="error" size={18} />
          <span>{message}</span>
        </div>
      )}

      {message && status === 'idle' && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <Icon name="check-circle" size={18} />
          <span>{message}</span>
        </div>
      )}

      {status === 'success' ? (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/login" className="auth-button" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Proceed to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="token" className="form-label">
              Verification Token
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left">
                <Icon name="key" size={16} />
              </span>
              <input
                id="token"
                type="text"
                className="form-input has-icon-left"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={status === 'loading'}
                placeholder="Paste verification token"
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={status === 'loading' || !token.trim()}>
            {status === 'loading' ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      )}

      <div className="auth-footer" style={{ marginTop: '24px' }}>
        <Link to="/login" className="auth-link">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
