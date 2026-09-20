import type { ReactNode } from 'react';
import logoAsset from '../../assets/wordmark.svg';
import { Icon } from '../ui/Icon';
import '../../styles/auth.css';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-page-container">
      {/* Left Column: Product Visual / Hero */}
      <div className="auth-hero-column">
        <div className="auth-hero-content">
          <div className="auth-hero-brand">
            <img src={logoAsset} alt="Relaxit" className="auth-hero-logo" />
          </div>

          <div className="auth-hero-copy">
            <h1 className="auth-hero-title">Sit Better.<br />Live Healthier.</h1>
            <p className="auth-hero-subtitle">
              Your intelligent sitting companion for real-time posture tracking, wellness insights, and active ergonomic guidance.
            </p>
          </div>

          <div className="auth-hero-features">
            <div className="hero-feature-item">
              <div className="feature-icon-wrapper">
                <Icon name="activity" size={18} />
              </div>
              <span>Real-time sensor telemetry & posture evaluation</span>
            </div>
            <div className="hero-feature-item">
              <div className="feature-icon-wrapper">
                <Icon name="alerts" size={18} />
              </div>
              <span>Ergonomic alerts & habit building insights</span>
            </div>
            <div className="hero-feature-item">
              <div className="feature-icon-wrapper">
                <Icon name="devices" size={18} />
              </div>
              <span>Seamless Relaxit smart backrest syncing</span>
            </div>
          </div>

          {/* Calming backrest visual illustration */}
          <div className="auth-hero-visual-card">
            <div className="hero-visual-chair">
              <svg width="180" height="200" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Chair outline */}
                <path d="M50 40C50 28.9543 58.9543 20 70 20H110C121.046 20 130 28.9543 130 40V120C130 125.523 125.523 130 120 130H60C54.4772 130 50 125.523 50 120V40Z" fill="#F0F6F2" stroke="#D2DFD6" strokeWidth="3" />
                <path d="M35 130C35 124.477 39.4772 120 45 120H135C140.523 120 145 124.477 145 130V140C145 145.523 140.523 150 135 150H45C39.4772 150 35 145.523 35 140V130Z" fill="#E2ECE5" stroke="#C4D6C9" strokeWidth="3" />
                {/* Relaxit Backrest Unit on chair */}
                <rect x="68" y="55" width="44" height="60" rx="12" fill="#FFFFFF" stroke="#16A34A" strokeWidth="3" />
                <rect x="76" y="70" width="28" height="6" rx="3" fill="#EAF7EE" />
                <rect x="78" y="82" width="24" height="6" rx="3" fill="#BBF7D0" />
                <circle cx="90" cy="98" r="3" fill="#16A34A" />
              </svg>
            </div>
            <p className="hero-visual-tagline">"A smarter way to sit, every session of the day."</p>
          </div>

          <div className="auth-hero-footer">
            <span>Relaxit Inc. &bull; Smart Hardware & Wellness</span>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form Area */}
      <div className="auth-form-column">
        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <img src={logoAsset} alt="Relaxit" className="auth-mobile-logo" />
          </div>

          <div className="auth-header">
            <h2 className="auth-title">{title}</h2>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          <div className="auth-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
