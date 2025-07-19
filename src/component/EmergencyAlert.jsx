import React, { useState, useEffect } from 'react';
import './EmergencyAlert.css';

const EmergencyAlert = () => {
  const [emergencyData, setEmergencyData] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load emergency message from localStorage
    const savedEmergency = JSON.parse(localStorage.getItem('emergencyMessage') || '{}');
    
    if (savedEmergency.message && savedEmergency.active) {
      setEmergencyData(savedEmergency);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!emergencyData || !isVisible) {
    return null;
  }

  return (
    <div className="emergency-alert-container">
      <div className="emergency-alert">
        <div className="alert-content">
          <div className="alert-icon">🚨</div>
          <div className="alert-text">
            <div className="alert-title">EMERGENCY ALERT</div>
            <div className="alert-message">{emergencyData.message}</div>
          </div>
          <button className="alert-close" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
