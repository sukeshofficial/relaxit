import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';

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
      // Backend generic response preserved intentionally
      await authApi.forgotPassword({ email: email.trim() });
    } catch {
      // Intentionally preserve generic response regardless of backend error or non-existence
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Reset your Relaxit password">
      {isSubmitted ? (
        <div style={{ textAlign: 'center' }}>
          <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
            If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
          </div>
          <p style={{ fontSize: '0.875rem', color: '#8b949e', marginBottom: '20px' }}>
            Please check your inbox and click the reset link provided.
          </p>
          <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Account Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${fieldError ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="you@example.com"
            />
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
