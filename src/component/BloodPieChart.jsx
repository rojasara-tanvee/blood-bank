import React, { useState, useEffect } from 'react';
import './BloodPieChart.css';

const BloodPieChart = () => {
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

  // Convert inventory data to pie chart format
  const totalUnits = Object.values(bloodInventory).reduce((sum, units) => sum + units, 0);

  const bloodData = Object.entries(bloodInventory).map(([type, units], index) => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];
    const percentage = totalUnits > 0 ? Math.round((units / totalUnits) * 100) : 0;

    return {
      type,
      units,
      percentage,
      color: colors[index] || '#95a5a6'
    };
  }).sort((a, b) => b.units - a.units); // Sort by units descending

  const [animatedData, setAnimatedData] = useState(bloodData.map(item => ({ ...item, animatedPercentage: 0 })));
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    // Animate the pie chart on component mount
    const timer = setTimeout(() => {
      setAnimatedData(bloodData.map(item => ({ ...item, animatedPercentage: item.percentage })));
    }, 500);

    return () => clearTimeout(timer);
  }, [bloodData]);

  // Calculate cumulative percentages for pie segments
  const calculateSegments = () => {
    let cumulative = 0;
    return animatedData.map(item => {
      const startAngle = cumulative * 3.6; // Convert percentage to degrees
      cumulative += item.animatedPercentage;
      const endAngle = cumulative * 3.6;
      return {
        ...item,
        startAngle,
        endAngle,
        strokeDasharray: `${item.animatedPercentage * 3.14159} 314.159`, // Circumference calculation
        strokeDashoffset: 314.159 - (cumulative - item.animatedPercentage) * 3.14159
      };
    });
  };

  const segments = calculateSegments();

  // Calculate dynamic insights based on current inventory
  const getDynamicInsights = () => {
    if (bloodData.length === 0) return { mostCommon: null, universalDonor: null, rarest: null };

    // Find most common (highest percentage)
    const mostCommon = bloodData.reduce((prev, current) =>
      (prev.percentage > current.percentage) ? prev : current
    );

    // Universal donor is always O- (if it exists)
    const universalDonor = bloodData.find(item => item.type === 'O-') ||
                          { type: 'O-', percentage: 0, units: 0 };

    // Find rarest (lowest percentage, but exclude zero values)
    const nonZeroData = bloodData.filter(item => item.percentage > 0);
    const rarest = nonZeroData.length > 0 ?
                   nonZeroData.reduce((prev, current) =>
                     (prev.percentage < current.percentage) ? prev : current
                   ) : bloodData[bloodData.length - 1];

    return { mostCommon, universalDonor, rarest };
  };

  const insights = getDynamicInsights();

  // Create SVG path for pie segment
  const createPath = (startAngle, endAngle, outerRadius = 90) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const d = [
      "M", 100, 100,
      "L", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
    
    return d;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="blood-pie-chart-section">
      <div className="pie-chart-header">
        <h2>🩸 Blood Group Distribution</h2>
        <p>Current blood bank composition by blood type</p>
      </div>

      <div className="pie-chart-container">
        <div className="pie-chart-wrapper">
          <svg className="pie-chart-svg" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#ecf0f1"
              strokeWidth="2"
            />
            
            {/* Pie segments */}
            {segments.map((segment) => (
              <g key={segment.type}>
                <path
                  d={createPath(segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  className={`pie-segment ${hoveredSegment === segment.type ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredSegment(segment.type)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: hoveredSegment === segment.type ? 'brightness(1.1)' : 'brightness(1)',
                    transform: hoveredSegment === segment.type ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '100px 100px'
                  }}
                />
                
                {/* Percentage labels */}
                {segment.animatedPercentage > 3 && (
                  <text
                    x={polarToCartesian(100, 100, 60, (segment.startAngle + segment.endAngle) / 2).x}
                    y={polarToCartesian(100, 100, 60, (segment.startAngle + segment.endAngle) / 2).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="pie-label"
                  >
                    {segment.animatedPercentage.toFixed(0)}%
                  </text>
                )}
              </g>
            ))}
            
            {/* Center circle with total */}
            <circle
              cx="100"
              cy="100"
              r="35"
              fill="white"
              stroke="#bdc3c7"
              strokeWidth="2"
            />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#2c3e50"
            >
              Total
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#e74c3c"
            >
              {totalUnits}
            </text>
          </svg>

          {/* Hover tooltip */}
          {hoveredSegment && (
            <div className="pie-tooltip">
              <div className="tooltip-content">
                <strong>{hoveredSegment}</strong>
                <br />
                {bloodData.find(item => item.type === hoveredSegment)?.units} units
                <br />
                {bloodData.find(item => item.type === hoveredSegment)?.percentage}% of total
              </div>
            </div>
          )}
        </div>

        <div className="pie-chart-legend">
          <h3>Blood Types</h3>
          <div className="legend-grid">
            {bloodData.map((item) => (
              <div
                key={item.type}
                className={`legend-item ${hoveredSegment === item.type ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredSegment(item.type)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div
                  className="legend-color-dot"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="legend-info">
                  <span className="legend-type">{item.type}</span>
                  <span className="legend-percentage">{item.percentage}%</span>
                  <span className="legend-units">{item.units} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pie-chart-insights">
        <div className="insight-cards">
          <div className="insight-card">
            <h4>🔴 Most Common</h4>
            <p>
              <strong>{insights.mostCommon?.type || 'N/A'}</strong> - {insights.mostCommon?.percentage || 0}% of current stock
            </p>
          </div>
          <div className="insight-card">
            <h4>🟡 Universal Donor</h4>
            <p>
              <strong>O-</strong> - {insights.universalDonor?.percentage || 0}% but saves all types
            </p>
          </div>
          <div className="insight-card">
            <h4>🔵 Rarest Type</h4>
            <p>
              <strong>{insights.rarest?.type || 'N/A'}</strong> - Only {insights.rarest?.percentage || 0}% of current stock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodPieChart;
