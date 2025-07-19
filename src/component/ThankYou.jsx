import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
  const navigate = useNavigate();
  const { hospitalName } = useParams();
  const location = useLocation();

  // Detect if this is a donation or request
  const isDonation = location.pathname.includes('donation-thank-you');

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRequestMore = () => {
    if (isDonation) {
      navigate('/donate-blood');
    } else {
      navigate('/request-blood');
    }
  };

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="thank-you-content">
          <h1>🎉 {isDonation ? 'Donation' : 'Request'} Submitted Successfully!</h1>

          <div className="hospital-info">
            <h2>📍 {hospitalName || 'Selected Hospital'}</h2>
            <p>Your blood {isDonation ? 'donation' : 'request'} has been sent to the hospital</p>
          </div>

          <div className="success-message">
            <div className="message-box">
              <h3>✅ What Happens Next?</h3>
              {isDonation ? (
                <ul>
                  <li>🏥 Hospital staff will review your donation offer</li>
                  <li>📞 You'll receive a call within 2-4 hours</li>
                  <li>🩸 Donation eligibility will be confirmed</li>
                  <li>📅 Donation appointment will be scheduled</li>
                  <li>🎯 Pre-donation health check will be arranged</li>
                </ul>
              ) : (
                <ul>
                  <li>🏥 Hospital staff will review your request</li>
                  <li>📞 You'll receive a call within 2-4 hours</li>
                  <li>🩸 Blood availability will be confirmed</li>
                  <li>📅 Collection/delivery details will be arranged</li>
                </ul>
              )}
            </div>
          </div>

          <div className="important-info">
            <div className="info-card emergency">
              <h4>🚨 Emergency?</h4>
              <p>For urgent cases, please call the hospital directly</p>
              <button className="emergency-btn">📞 Call Hospital</button>
            </div>
            
            <div className="info-card reference">
              <h4>📋 Reference Number</h4>
              <p className="ref-number" style={{ color: 'black', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {localStorage.getItem('lastReferenceNumber') || `REF-${Date.now().toString().slice(-6)}`}
              </p>
              <small>Save this number for future reference and tracking</small>
              <button
                className="track-btn"
                onClick={() => navigate('/track-request')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔍 Track Request
              </button>
            </div>


          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleGoHome}>
              🏠 Go to Home
            </button>
            <button className="btn-secondary" onClick={handleRequestMore}>
              {isDonation ? '🩸 Donate More Blood' : '🩸 Request More Blood'}
            </button>
          </div>

          {/* Manual Navigation Only */}
          <div className="manual-navigation">
            <p>Thank you for using our blood bank service!</p>
            <p>You can navigate using the buttons above or the menu.</p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-heart">❤️</div>
          <div className="floating-heart">🩸</div>
          <div className="floating-heart">💝</div>
          <div className="floating-heart">🙏</div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
