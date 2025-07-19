import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BloodStorageChart.css';

const BloodStorageChart = () => {
  // Load blood inventory from localStorage (same as admin panel)
  const [bloodInventory, setBloodInventory] = useState({
    'A+': 45, 'A-': 22, 'B+': 38, 'B-': 18,
    'AB+': 25, 'AB-': 12, 'O+': 55, 'O-': 28
  });

  // Load inventory from localStorage on component mount
  useEffect(() => {
    const loadInventory = () => {
      const savedInventory = localStorage.getItem('bloodInventory');
      if (savedInventory) {
        setBloodInventory(JSON.parse(savedInventory));
      }
    };

    loadInventory();

    // Listen for storage changes (when admin updates inventory)
    const handleStorageChange = (e) => {
      if (e.key === 'bloodInventory' && e.newValue) {
        setBloodInventory(JSON.parse(e.newValue));
      }
    };

    // Listen for custom inventory update events
    const handleInventoryUpdate = () => {
      loadInventory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bloodInventoryUpdated', handleInventoryUpdate);

    // Periodic check for updates (every 5 seconds)
    const interval = setInterval(loadInventory, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bloodInventoryUpdated', handleInventoryUpdate);
      clearInterval(interval);
    };
  }, []);

  // Convert inventory data to chart format
  const bloodData = Object.entries(bloodInventory).map(([type, units]) => {
    const maxUnits = 100; // Maximum capacity per blood type
    const percentage = (units / maxUnits) * 100;

    let status, color;
    if (percentage >= 80) {
      status = 'Excellent';
      color = '#27ae60';
    } else if (percentage >= 60) {
      status = 'Good';
      color = '#f39c12';
    } else if (percentage >= 30) {
      status = 'Low';
      color = '#e67e22';
    } else {
      status = 'Critical';
      color = '#e74c3c';
    }

    return { type, units, maxUnits, color, status };
  });

  const [animatedData, setAnimatedData] = useState(bloodData.map(item => ({ ...item, animatedUnits: 0 })));

  // Update animated data when bloodData changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(bloodData.map(item => ({ ...item, animatedUnits: item.units })));
    }, 500);

    return () => clearTimeout(timer);
  }, [bloodData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return '#27ae60';
      case 'Good': return '#f39c12';
      case 'Low': return '#e67e22';
      case 'Critical': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent': return '🟢';
      case 'Good': return '🟡';
      case 'Low': return '🟠';
      case 'Critical': return '🔴';
      default: return '⚪';
    }
  };

  const totalUnits = bloodData.reduce((sum, item) => sum + item.units, 0);
  const totalCapacity = bloodData.reduce((sum, item) => sum + item.maxUnits, 0);
  const overallPercentage = Math.round((totalUnits / totalCapacity) * 100);

  return (
    <div className="blood-storage-section">
      <div className="storage-header">
        <h2>🩸 Blood Bank Storage Status</h2>
        <div className="overall-stats">
          <div className="stat-card">
            <h3>{totalUnits}</h3>
            <p>Total Units</p>
          </div>
          <div className="stat-card">
            <h3>{overallPercentage}%</h3>
            <p>Capacity</p>
          </div>
          <div className="stat-card">
            <h3>{bloodData.filter(item => item.status === 'Critical').length}</h3>
            <p>Critical</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="blood-chart">
          {animatedData.map((blood, index) => (
            <div key={blood.type} className="blood-bar-container">
              <div className="blood-type-label">
                <span className="blood-type">{blood.type}</span>
                <span className="status-indicator">
                  {getStatusIcon(blood.status)}
                </span>
              </div>
              
              <div className="blood-bar-wrapper">
                <div className="blood-bar-background">
                  <div 
                    className="blood-bar-fill"
                    style={{
                      width: `${(blood.animatedUnits / blood.maxUnits) * 100}%`,
                      backgroundColor: blood.color,
                      transition: 'width 2s ease-out',
                      transitionDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="blood-bar-shine"></div>
                  </div>
                </div>
                <div className="blood-units">
                  {blood.animatedUnits}/{blood.maxUnits}
                </div>
              </div>
              
              <div className="status-badge" style={{ backgroundColor: getStatusColor(blood.status) }}>
                {blood.status}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <h4>Status Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color excellent"></span>
              <span>Excellent (80-100%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color good"></span>
              <span>Good (60-79%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color low"></span>
              <span>Low (30-59%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color critical"></span>
              <span>Critical (0-29%)</span>
            </div>
          </div>
        </div>
      </div>



      <div className="donation-call-to-action">
        <div className="cta-content">
          <h3>Help Save Lives Today!</h3>
          <p>Your donation can make a difference. Every unit counts.</p>
          <Link to="/donate-blood">
            <button className="donate-now-btn">
              🩸 Donate Blood Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodStorageChart;
