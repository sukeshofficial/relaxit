import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';
import { Icon } from '../../components/ui/Icon';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!token.trim()) errors.token = 'Reset token is required.';
    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long.';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await authApi.resetPassword({
        token: token.trim(),
        newPassword,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setServerError(res.message || 'Password reset failed.');
        if (res.errors) setFieldErrors(res.errors);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      if (axiosErr.response?.data) {
        setServerError(
          axiosErr.response.data.message || 'Password reset failed. Token may be invalid or expired.'
        );
        if (axiosErr.response.data.errors) {
          setFieldErrors(axiosErr.response.data.errors);
        }
      } else {
        setServerError('Network error. Unable to connect to server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Choose a strong new password for your account">
      {isSuccess ? (
        <div style={{ textAlign: 'center' }}>
          <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
            <Icon name="check-circle" size={18} />
            <span>Password reset successfully! You can now sign in with your new password.</span>
          </div>
          <Link to="/login" className="auth-button" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Proceed to Sign In
          </Link>
        </div>
      ) : (
        <>
          {serverError && (
            <div className="alert-box alert-error">
              <Icon name="error" size={18} />
              <span>{serverError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {!tokenParam && (
              <div className="form-group">
                <label htmlFor="token" className="form-label">
                  Reset Token
                </label>
                <div className="input-with-icon">
                  <span className="input-icon-left">
                    <Icon name="key" size={16} />
                  </span>
                  <input
                    id="token"
                    type="text"
                    className={`form-input has-icon-left ${fieldErrors.token ? 'has-error' : ''}`}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Paste reset token"
                  />
                </div>
                {fieldErrors.token && <span className="field-error">{fieldErrors.token}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <Icon name="key" size={16} />
                </span>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input has-icon-left ${fieldErrors.newPassword ? 'has-error' : ''}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="At least 8 characters"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
              {fieldErrors.newPassword && (
                <span className="field-error">{fieldErrors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <Icon name="key" size={16} />
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input has-icon-left ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Confirm new password"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>
        </>
      )}

      <div className="auth-footer" style={{ marginTop: '24px' }}>
        <Link to="/login" className="auth-link">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
