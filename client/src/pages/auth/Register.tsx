import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { authApi } from '../../api/auth.api';
import { Icon } from '../../components/ui/Icon';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required.';
    if (!lastName.trim()) errors.lastName = 'Last name is required.';
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
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
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const fullName = `${trimmedFirstName} ${trimmedLastName}`;

    try {
      const res = await authApi.register({
        email: email.trim(),
        password,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        fullName,
      });
      if (res.success) {
        navigate('/verify-email', {
          state: { message: 'Registration successful! Please verify your email to continue.' },
        });
      } else {
        setServerError(res.message || 'Registration failed.');
        if (res.errors) setFieldErrors(res.errors);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      if (axiosErr.response?.data) {
        setServerError(axiosErr.response.data.message || 'Validation failed');
        if (axiosErr.response.data.errors) {
          const errs: Record<string, string> = {};
          Object.entries(axiosErr.response.data.errors).forEach(([key, val]) => {
            if (key === 'fullName') {
              errs.firstName = val;
              errs.lastName = val;
            } else {
              errs[key] = val;
            }
          });
          setFieldErrors(errs);
        }
      } else {
        setServerError('Network error. Unable to connect to server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your Relaxit account" subtitle="Join Relaxit and start tracking your sitting posture">
      {serverError && (
        <div className="alert-box alert-error">
          <Icon name="error" size={18} />
          <span>{serverError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`form-input ${fieldErrors.firstName ? 'has-error' : ''}`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              placeholder="Sukesh"
            />
            {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`form-input ${fieldErrors.lastName ? 'has-error' : ''}`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
              placeholder="Official"
            />
            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="input-with-icon">
            <span className="input-icon-left">
              <Icon name="user" size={16} />
            </span>
            <input
              id="email"
              type="email"
              className={`form-input has-icon-left ${fieldErrors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="you@example.com"
            />
          </div>
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-with-icon">
            <span className="input-icon-left">
              <Icon name="key" size={16} />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input has-icon-left ${fieldErrors.password ? 'has-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
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
              placeholder="Confirm password"
            />
          </div>
          {fieldErrors.confirmPassword && (
            <span className="field-error">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        <span>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
