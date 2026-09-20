import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
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
      const res = await authApi.login({ email, password });
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setServerError(res.message || 'Login failed. Please check your credentials.');
        if (res.errors) setFieldErrors(res.errors);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      if (axiosErr.response?.data) {
        setServerError(axiosErr.response.data.message || 'Invalid credentials.');
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
    <AuthLayout title="Sign In" subtitle="Welcome back to Relaxit">
      {serverError && <div className="alert-box alert-error">{serverError}</div>}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="you@example.com"
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.8rem' }}>
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            placeholder="••••••••"
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <span>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
