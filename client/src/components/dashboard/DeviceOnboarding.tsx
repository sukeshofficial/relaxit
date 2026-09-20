import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DeviceOnboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-state" style={{ margin: '48px auto', maxWidth: '540px' }}>
      <div className="empty-state-icon">&#128268;</div>
      <h3 className="empty-state-title">No Relaxit Devices Paired</h3>
      <p className="empty-state-text">
        To start tracking your posture, sitting habits, and wellness statistics, pair your first physical or virtual Relaxit device.
      </p>
      <button className="btn-primary" onClick={() => navigate('/devices')}>
        Go to Device Management
      </button>
    </div>
  );
};
