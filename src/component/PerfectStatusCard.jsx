import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackRequest.css';

const PerfectStatusCard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Perfect demo data matching your image but with enhanced details
  const trackingData = {
    referenceNumber: 'REF-985356',
    status: 'accepted',
    type: 'donation',
    hospital: 'Apollo',
    bloodGroup: 'A+',
    submittedDate: '17/7/2025',
    lastUpdated: '18/7/2025',
    timeline: [
      { 
        status: 'pending', 
        icon: '⏳',
        date: '17/7/2025, 11:59:45 pm',
        message: 'Request submitted successfully'
      },
      { 
        status: 'accepted', 
        icon: '✅',
        date: '18/7/2025, 09:30:15 am',
        message: 'Request has been accepted by hospital'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'approved': return '#27ae60';
      case 'accepted': return '#2ecc71';
      case 'rejected': return '#e74c3c';
      case 'completed': return '#8e44ad';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'accepted': return '🎯';
      case 'rejected': return '❌';
      case 'completed': return '🏆';
      default: return '📋';
    }
  };

  return (
    <div className="track-request-page">
      <div className="track-container">
        <div className="track-header">
          <h2>🎯 Perfect Status Card UI</h2>
          <p>This is the stunning, modern status card design you requested</p>
        </div>

        <div className="tracking-results">
          <div className="modern-status-card">
            {/* Status Header with Icon and Title */}
            <div className="status-header-modern">
              <div className="status-icon-large" style={{ backgroundColor: getStatusColor(trackingData.status) }}>
                {getStatusIcon(trackingData.status)}
              </div>
              <div className="status-title-section">
                <h2 className="status-title">Request Status: {trackingData.status}</h2>
                <div className="reference-box">
                  <span className="ref-label">Reference:</span>
                  <span className="ref-value">{trackingData.referenceNumber}</span>
                </div>
              </div>
            </div>

            {/* Request Details Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{trackingData.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hospital:</span>
                <span className="detail-value">{trackingData.hospital}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Blood Group:</span>
                <span className="detail-value">{trackingData.bloodGroup}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submitted:</span>
                <span className="detail-value">{trackingData.submittedDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{trackingData.lastUpdated}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="timeline-section">
              <div className="timeline-header">
                <span className="timeline-icon">📅</span>
                <h3>Status Timeline</h3>
              </div>
              <div className="timeline-container">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className="timeline-event">
                    <div className="timeline-marker">
                      <div 
                        className="timeline-dot-modern" 
                        style={{ backgroundColor: getStatusColor(event.status) }}
                      ></div>
                      {index < trackingData.timeline.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-details">
                      <div className="timeline-status-modern">{event.status}</div>
                      <div className="timeline-date-modern">{event.date}</div>
                      <div className="timeline-message-modern">{event.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-modern">
              <button 
                className="refresh-btn" 
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    setIsRefreshing(false);
                    alert('Status refreshed! 🎉');
                  }, 2000);
                }}
                disabled={isRefreshing}
              >
                <span className="btn-icon">🔄</span>
                {isRefreshing ? 'REFRESHING...' : 'REFRESH STATUS'}
              </button>
              <button 
                className="home-btn" 
                onClick={() => navigate('/')}
              >
                <span className="btn-icon">🏠</span>
                GO HOME
              </button>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>✨ Perfect UI Features</h3>
          <div className="help-cards">
            <div className="help-card">
              <h4>🎨 Modern Design</h4>
              <p>Beautiful gradients, shadows, and animations create a premium user experience.</p>
            </div>
            <div className="help-card">
              <h4>📱 Responsive Layout</h4>
              <p>Perfectly adapts to all screen sizes with mobile-first design principles.</p>
            </div>
            <div className="help-card">
              <h4>⚡ Interactive Elements</h4>
              <p>Smooth hover effects, loading states, and micro-animations enhance usability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectStatusCard;
