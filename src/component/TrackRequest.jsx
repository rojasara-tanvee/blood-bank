import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackRequest.css';

const TrackRequest = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleTrackRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number');
      setLoading(false);
      return;
    }

    try {
      // Get requests from localStorage
      const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');

      // Very simple search - just by reference number first
      let request = existingRequests.find(req => req.referenceNumber === referenceNumber);

      if (!request) {
        // If not found, show all available reference numbers for debugging
        const allRefs = existingRequests.map(req => req.referenceNumber);
        setError(`Reference number "${referenceNumber}" not found.

Available reference numbers: ${allRefs.length > 0 ? allRefs.join(', ') : 'None'}

Please check your reference number or submit a new request first.`);
        setLoading(false);
        return;
      }

      // Found by reference number, now check contact details
      const contactMatches = (
        request.phone === contactNumber ||
        request.contact === contactNumber ||
        request.email === email ||
        request.phone === email ||
        request.contact === email
      );

      if (!contactMatches) {
        setError(`Reference number found, but contact details don't match.

Stored contact: ${request.phone || request.contact}
Stored email: ${request.email}

Your input:
Contact: ${contactNumber}
Email: ${email}

Please check your contact details.`);
        setLoading(false);
        return;
      }

      // Success - show the request with proper timeline
      const trackingData = {
        ...request,
        timeline: request.timeline || [
          {
            status: request.status || 'pending',
            date: request.submittedAt,
            message: 'Request submitted successfully'
          }
        ]
      };

      // If status was updated but timeline doesn't reflect it, add the current status
      if (request.status && request.status !== 'pending') {
        const hasCurrentStatus = trackingData.timeline.some(event => event.status === request.status);
        if (!hasCurrentStatus) {
          trackingData.timeline.push({
            status: request.status,
            date: request.updatedAt || new Date().toISOString(),
            message: request.adminMessage || `Status updated to ${request.status}`
          });
        }
      }

      setTrackingData(trackingData);

    } catch (error) {
      setError('Error reading stored data. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h2>🔍 Track Your Request</h2>
          <p>Enter your reference number to check the status of your blood donation or request</p>
        </div>

        <form onSubmit={handleTrackRequest} className="track-form">
          <div className="form-group">
            <label htmlFor="referenceNumber">Reference Number *</label>
            <input
              type="text"
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter your reference number (e.g., REF-123456)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your contact number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button type="submit" className="track-btn" disabled={loading}>
            {loading ? '🔄 Tracking...' : '🔍 Track Request'}
          </button>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </form>

        {trackingData && (
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
                  <span className="detail-value">{new Date(trackingData.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{new Date(trackingData.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Timeline */}
              {trackingData.timeline && (
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
                          <div className="timeline-date-modern">{new Date(event.date).toLocaleString()}</div>
                          {event.message && <div className="timeline-message-modern">{event.message}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons-modern">
                <button
                  className="refresh-btn"
                  onClick={() => {
                    setIsRefreshing(true);
                    // Re-fetch the data from localStorage
                    setTimeout(() => {
                      const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
                      const updatedRequest = existingRequests.find(req => req.referenceNumber === referenceNumber);

                      if (updatedRequest) {
                        const updatedTrackingData = {
                          ...updatedRequest,
                          timeline: updatedRequest.timeline || [
                            {
                              status: updatedRequest.status || 'pending',
                              date: updatedRequest.submittedAt,
                              message: 'Request submitted successfully'
                            }
                          ]
                        };

                        // If status was updated but timeline doesn't reflect it, add the current status
                        if (updatedRequest.status && updatedRequest.status !== 'pending') {
                          const hasCurrentStatus = updatedTrackingData.timeline.some(event => event.status === updatedRequest.status);
                          if (!hasCurrentStatus) {
                            updatedTrackingData.timeline.push({
                              status: updatedRequest.status,
                              date: updatedRequest.updatedAt || new Date().toISOString(),
                              message: updatedRequest.adminMessage || `Status updated to ${updatedRequest.status}`
                            });
                          }
                        }

                        setTrackingData(updatedTrackingData);
                      }
                      setIsRefreshing(false);
                    }, 1000);
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
        )}

        <div className="help-section">
          <h3>📞 Need Help?</h3>
          <div className="help-cards">
            <div className="help-card">
              <h4>📋 Reference Number</h4>
              <p>Your reference number was provided when you submitted your request. Check your email or SMS for the reference number.</p>
            </div>
            <div className="help-card">
              <h4>📱 Notifications</h4>
              <p>You'll receive email and SMS updates when your request status changes. Make sure your contact details are correct.</p>
            </div>
            <div className="help-card">
              <h4>🏥 Contact Hospital</h4>
              <p>For urgent matters, contact the hospital directly using the contact information provided in your confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRequest;
