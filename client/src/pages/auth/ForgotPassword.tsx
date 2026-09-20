import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';
import { Icon } from '../../components/ui/Icon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!email.trim()) {
      setFieldError('Email address is required.');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
    } catch {
      // Intentionally preserve generic response regardless of backend error
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your registered email and we'll send reset instructions">
      {isSubmitted ? (
        <div style={{ textAlign: 'center' }}>
          <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
            <Icon name="check-circle" size={18} />
            <span>If an account exists for <strong>{email}</strong>, password reset instructions have been sent.</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Please check your email inbox and follow the link to reset your password.
          </p>
          <Link to="/login" className="auth-button" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Account Email Address
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left">
                <Icon name="user" size={16} />
              </span>
              <input
                id="email"
                type="email"
                className={`form-input has-icon-left ${fieldError ? 'has-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="you@example.com"
              />
            </div>
            {fieldError && <span className="field-error">{fieldError}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending instructions...' : 'Send Reset Instructions'}
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
