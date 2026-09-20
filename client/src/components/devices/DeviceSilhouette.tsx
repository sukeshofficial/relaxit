interface DeviceSilhouetteProps {
  size?: 'sm' | 'md' | 'lg';
  status?: 'ONLINE' | 'OFFLINE' | 'INACTIVE' | string;
  className?: string;
}

export function DeviceSilhouette({ size = 'md', status = 'OFFLINE', className = '' }: DeviceSilhouetteProps) {
  const dimensions = {
    sm: { width: 44, height: 56, iconSize: 20 },
    md: { width: 72, height: 96, iconSize: 32 },
    lg: { width: 110, height: 140, iconSize: 48 },
  }[size];

  const isOnline = status?.toUpperCase() === 'ONLINE';

  return (
    <div
      className={`device-silhouette-container ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size === 'lg' ? '20px' : '14px',
        background: 'linear-gradient(145deg, #F9FBF9 0%, #E8EFEA 100%)',
        border: '1.5px solid #DCE5DF',
        boxShadow: '0 4px 10px rgba(23, 32, 27, 0.05)',
        flexShrink: 0,
      }}
    >
      {/* Backrest lumbar curves */}
      <svg
        width={dimensions.width * 0.7}
        height={dimensions.height * 0.7}
        viewBox="0 0 40 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main contoured backrest frame */}
        <path
          d="M8 6C8 3.79086 9.79086 2 12 2H28C30.2091 2 32 3.79086 32 6V30C32 34 36 37 36 41V46C36 48.2091 34.2091 50 32 50H8C5.79086 50 4 48.2091 4 46V41C4 37 8 34 8 30V6Z"
          fill="#FFFFFF"
          stroke="#C8D6CD"
          strokeWidth="2"
        />
        {/* Ergo lumbar support ribbing */}
        <rect x="12" y="12" width="16" height="3" rx="1.5" fill="#E2EBE5" />
        <rect x="10" y="20" width="20" height="4" rx="2" fill="#D4E2D8" />
        <rect x="12" y="29" width="16" height="3" rx="1.5" fill="#E2EBE5" />

        {/* Sensor array dots */}
        <circle cx="15" cy="22" r="1" fill={isOnline ? '#16A34A' : '#8A968F'} />
        <circle cx="25" cy="22" r="1" fill={isOnline ? '#16A34A' : '#8A968F'} />
        <circle cx="20" cy="42" r="1.5" fill={isOnline ? '#16A34A' : '#8A968F'} />
      </svg>

      {/* Online indicator halo on badge */}
      {isOnline && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#16A34A',
            boxShadow: '0 0 0 2px #FFFFFF, 0 0 6px rgba(22, 163, 74, 0.6)',
          }}
        />
      )}
    </div>
  );
}
