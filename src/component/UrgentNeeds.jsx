import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UrgentNeeds.css';

const UrgentNeeds = () => {
  const [urgentRequests, setUrgentRequests] = useState([]);

  const [animatedRequests, setAnimatedRequests] = useState([]);

  // Helper function to calculate time ago dynamically
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return '0 minutes ago';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Load urgent requests from localStorage and handle auto-deletion
  useEffect(() => {
    const loadUrgentRequests = () => {
      const savedRequests = JSON.parse(localStorage.getItem('urgentBloodRequests') || '[]');

      // Filter out expired requests based on deadline
      const currentTime = new Date();
      const activeRequests = savedRequests.filter(request => {
        if (!request.createdAt) return true; // Keep requests without createdAt for backward compatibility

        const createdTime = new Date(request.createdAt);
        const deadlineHours = parseInt(request.deadline.match(/\d+/)?.[0] || '24'); // Extract hours from deadline
        const expiryTime = new Date(createdTime.getTime() + (deadlineHours * 60 * 60 * 1000));

        return currentTime < expiryTime;
      });

      // Update localStorage if any requests were removed
      if (activeRequests.length !== savedRequests.length) {
        localStorage.setItem('urgentBloodRequests', JSON.stringify(activeRequests));
        console.log(`🗑️ Removed ${savedRequests.length - activeRequests.length} expired urgent blood requests`);
      }

      // If no active requests, show default sample data with dynamic time
      if (activeRequests.length === 0) {
        const now = new Date();
        const defaultRequests = [
          {
            id: 1,
            hospital: "Apollo Hospital",
            location: "Surat",
            bloodType: "O-",
            unitsNeeded: 15,
            priority: "Critical",
            createdAt: new Date(now.getTime() - (2 * 60 * 60 * 1000)).toISOString(), // 2 hours ago
            contact: "+91 98765 43210",
            reason: "Emergency Surgery",
            deadline: "Within 6 hours"
          },
          {
            id: 2,
            hospital: "New Life Hospital",
            location: "Ahmedabad",
            bloodType: "AB-",
            unitsNeeded: 8,
            priority: "High",
            createdAt: new Date(now.getTime() - (4 * 60 * 60 * 1000)).toISOString(), // 4 hours ago
            contact: "+91 98765 43211",
            reason: "Cancer Treatment",
            deadline: "Within 12 hours"
          },
          {
            id: 3,
            hospital: "City Care Hospital",
            location: "Mumbai",
            bloodType: "B-",
            unitsNeeded: 12,
            priority: "Critical",
            createdAt: new Date(now.getTime() - (1 * 60 * 60 * 1000)).toISOString(), // 1 hour ago
            contact: "+91 98765 43212",
            reason: "Accident Victim",
            deadline: "Within 4 hours"
          }
        ];

        // Add dynamic timePosted to default requests
        const requestsWithDynamicTime = defaultRequests.map(request => ({
          ...request,
          timePosted: getTimeAgo(new Date(request.createdAt))
        }));

        setUrgentRequests(requestsWithDynamicTime);
      } else {
        // Add dynamic timePosted to active requests
        const requestsWithDynamicTime = activeRequests.map(request => ({
          ...request,
          timePosted: request.createdAt ? getTimeAgo(new Date(request.createdAt)) : request.timePosted || 'Unknown'
        }));

        setUrgentRequests(requestsWithDynamicTime);
      }
    };

    loadUrgentRequests();

    // Set up interval to refresh data and check for expired requests every 60 seconds
    const interval = setInterval(loadUrgentRequests, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update time every minute for dynamic time display
  useEffect(() => {
    const updateTimeInterval = setInterval(() => {
      setUrgentRequests(prevRequests =>
        prevRequests.map(request => ({
          ...request,
          timePosted: request.createdAt ? getTimeAgo(new Date(request.createdAt)) : request.timePosted || 'Unknown'
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(updateTimeInterval);
  }, []);

  useEffect(() => {
    // Animate the cards on component mount
    const timer = setTimeout(() => {
      setAnimatedRequests(urgentRequests);
    }, 300);

    return () => clearTimeout(timer);
  }, [urgentRequests]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#e74c3c';
      case 'High': return '#e67e22';
      case 'Medium': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '🟡';
      default: return '⚪';
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': '#e74c3c', 'A-': '#c0392b',
      'B+': '#3498db', 'B-': '#2980b9',
      'AB+': '#9b59b6', 'AB-': '#8e44ad',
      'O+': '#27ae60', 'O-': '#16a085'
    };
    return colors[bloodType] || '#95a5a6';
  };

  return (
    <div className="urgent-needs-section">
      <div className="urgent-header">
        <div className="header-content">
          <h2>🚨 Urgent Blood Needs</h2>
          <p>Hospitals in critical need of blood donations</p>
        </div>
        <div className="live-indicator">
          <div className="pulse-dot"></div>
          <span>Live Updates</span>
        </div>
      </div>

      <div className="urgent-cards-container">
        {animatedRequests.map((request, index) => (
          <div 
            key={request.id} 
            className={`urgent-card priority-${request.priority.toLowerCase()}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-header">
              <div className="hospital-info">
                <h3>{request.hospital}</h3>
                <p className="location">📍 {request.location}</p>
              </div>
              <div className="priority-badge" style={{ backgroundColor: getPriorityColor(request.priority) }}>
                {getPriorityIcon(request.priority)} {request.priority}
              </div>
            </div>

            <div className="blood-requirement">
              <div className="blood-type-display">
                <div 
                  className="blood-type-circle"
                  style={{ backgroundColor: getBloodTypeColor(request.bloodType) }}
                >
                  {request.bloodType}
                </div>
                <div className="units-needed">
                  <span className="units-number">{request.unitsNeeded}</span>
                  <span className="units-text">Units Needed</span>
                </div>
              </div>
            </div>

            <div className="request-details">
              <div className="detail-row">
                <span className="detail-label">Reason:</span>
                <span className="detail-value">{request.reason}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Deadline:</span>
                <span className="detail-value urgent-deadline">{request.deadline}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Posted:</span>
                <span className="detail-value">{request.timePosted}</span>
              </div>
            </div>

            <div className="card-actions">
              <Link to="/donate-blood" className="donate-btn">
                🩸 Donate Now
              </Link>
              <a href={`tel:${request.contact}`} className="contact-btn">
                📞 Call Hospital
              </a>
            </div>

            <div className="urgency-indicator">
              <div className="urgency-bar">
                <div 
                  className="urgency-fill"
                  style={{ 
                    width: request.priority === 'Critical' ? '100%' : 
                           request.priority === 'High' ? '75%' : '50%',
                    backgroundColor: getPriorityColor(request.priority)
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="urgent-footer">
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{urgentRequests.filter(r => r.priority === 'Critical').length}</span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{urgentRequests.reduce((sum, r) => sum + r.unitsNeeded, 0)}</span>
            <span className="stat-label">Total Units</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(urgentRequests.map(r => r.location)).size}</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>
        
        <div className="call-to-action">
          <h3>Every Donation Saves Lives</h3>
          <p>Your blood donation can help these hospitals save patients in critical condition</p>
          <Link to="/donate-blood" className="main-donate-btn">
            🩸 Start Donating Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UrgentNeeds;
