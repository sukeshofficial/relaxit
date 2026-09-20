import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import logoAsset from '../assets/wordmark.svg';

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0d0f12',
        color: '#f1f5f9',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #30363d',
          paddingBottom: '16px',
          marginBottom: '32px',
        }}
      >
        <img src={logoAsset} alt="Relaxit Logo" style={{ width: '150px', height: 'auto' }} />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            padding: '8px 16px',
            backgroundColor: '#da3633',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </header>

      <main style={{ width: '100%', maxWidth: '800px' }}>
        <div
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(46, 160, 67, 0.15)',
              color: '#3fb950',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            AUTHENTICATED SESSION
          </div>

          <h1 style={{ margin: '0 0 12px 0', fontSize: '1.75rem', fontWeight: 600 }}>
            Welcome, {user?.fullName || 'User'}
          </h1>
          <p style={{ margin: '0 0 24px 0', color: '#8b949e', fontSize: '0.95rem' }}>
            Relaxit Phase 2 Authentication & Protected Routing Verification Surface.
          </p>

          <div style={{ display: 'grid', gap: '12px', background: '#0d1117', padding: '16px', borderRadius: '8px', border: '1px solid #21262d' }}>
            <div>
              <span style={{ color: '#8b949e', fontSize: '0.8125rem' }}>User ID: </span>
              <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{user?.id}</span>
            </div>
            <div>
              <span style={{ color: '#8b949e', fontSize: '0.8125rem' }}>Email: </span>
              <span style={{ fontWeight: 500 }}>{user?.email}</span>
            </div>
            <div>
              <span style={{ color: '#8b949e', fontSize: '0.8125rem' }}>Role: </span>
              <span style={{ fontWeight: 500 }}>{user?.role}</span>
            </div>
            <div>
              <span style={{ color: '#8b949e', fontSize: '0.8125rem' }}>Email Verified: </span>
              <span style={{ fontWeight: 500, color: user?.emailVerified ? '#3fb950' : '#f85149' }}>
                {user?.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <a
              href="/devices"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 18px',
                backgroundColor: '#238636',
                color: '#ffffff',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Manage My Devices &rarr;
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

