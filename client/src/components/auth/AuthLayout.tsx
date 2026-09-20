import type { ReactNode } from 'react';
import logoAsset from '../../assets/wordmark.svg';
import '../../styles/auth.css';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src={logoAsset} alt="Relaxit Logo" className="auth-logo" />
      </div>
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
