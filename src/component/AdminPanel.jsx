import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Requests Management States
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all'); // New filter for donation/request type

  // Blood Inventory States
  const [bloodInventory, setBloodInventory] = useState({
    'A+': 45, 'A-': 22, 'B+': 38, 'B-': 18,
    'AB+': 25, 'AB-': 12, 'O+': 55, 'O-': 28
  });
  const [inventoryUpdate, setInventoryUpdate] = useState({ bloodType: '', units: '', action: 'add' });

  // Status Update States
  const [referenceNumber, setReferenceNumber] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Hospital Management States
  const [hospitals, setHospitals] = useState([]);
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    emergencyContact: '',
    bloodTypes: [],
    isEmergency: false
  });

  // Emergency Message States
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Urgent Blood Request States
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [urgentBloodForm, setUrgentBloodForm] = useState({
    hospital: '',
    location: '',
    bloodType: '',
    unitsNeeded: '',
    priority: '',
    contact: '',
    reason: '',
    deadline: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f39c12' },
    { value: 'approved', label: 'Approved', color: '#3498db' },
    { value: 'accepted', label: 'Accepted', color: '#27ae60' },
    { value: 'rejected', label: 'Rejected', color: '#e74c3c' },
    { value: 'completed', label: 'Completed', color: '#9b59b6' }
  ];

  // Check admin authentication and load data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const email = localStorage.getItem('userEmail');

    if (isLoggedIn && isAdmin && email === 'admin@gmail.com') {
      setIsAuthenticated(true);
      setUserEmail(email);
    } else {
      setIsAuthenticated(false);
    }

    const requests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    setAllRequests(requests);
    setFilteredRequests(requests);

    // Load hospitals
    const savedHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    setHospitals(savedHospitals);

    // Load emergency message
    const savedEmergency = JSON.parse(localStorage.getItem('emergencyMessage') || '{}');
    if (savedEmergency.message) {
      setEmergencyMessage(savedEmergency.message);
      setEmergencyActive(savedEmergency.active || false);
    }

    // Load urgent blood requests
    const savedUrgentRequests = JSON.parse(localStorage.getItem('urgentBloodRequests') || '[]');
    setUrgentRequests(savedUrgentRequests);

    // Load blood inventory
    const savedInventory = JSON.parse(localStorage.getItem('bloodInventory') || '{}');
    if (Object.keys(savedInventory).length > 0) {
      setBloodInventory(savedInventory);
    }
  }, []);

  // Filter requests based on status and type
  useEffect(() => {
    let filtered = allRequests;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }

    // Filter by type (donation/request)
    if (filterType !== 'all') {
      filtered = filtered.filter(req => req.type === filterType);
    }

    setFilteredRequests(filtered);
  }, [allRequests, filterStatus, filterType]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    window.location.href = '/login';
  };

  // Update request status
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const requests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      const requestIndex = requests.findIndex(req => req.referenceNumber === referenceNumber);

      if (requestIndex === -1) {
        setResult('❌ Request not found with this reference number');
        setLoading(false);
        return;
      }

      requests[requestIndex].status = newStatus;
      requests[requestIndex].updatedAt = new Date().toISOString();
      requests[requestIndex].adminMessage = message;

      // Initialize timeline if it doesn't exist
      if (!requests[requestIndex].timeline) {
        requests[requestIndex].timeline = [
          {
            status: 'pending',
            date: requests[requestIndex].submittedAt,
            message: 'Request submitted successfully'
          }
        ];
      }

      // Add new status to timeline
      requests[requestIndex].timeline.push({
        status: newStatus,
        date: new Date().toISOString(),
        message: message || `Status updated to ${newStatus}`
      });

      localStorage.setItem('bloodRequests', JSON.stringify(requests));
      setAllRequests(requests);

      setResult(`✅ Status updated successfully! Reference: ${referenceNumber} → ${newStatus}`);
      setReferenceNumber('');
      setNewStatus('');
      setMessage('');

    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update blood inventory
  const handleInventoryUpdate = (e) => {
    e.preventDefault();
    const { bloodType, units, action } = inventoryUpdate;

    if (!bloodType || !units) {
      setResult('❌ Please fill all inventory fields');
      return;
    }

    const unitsNum = parseInt(units);
    if (isNaN(unitsNum) || unitsNum <= 0) {
      setResult('❌ Please enter a valid number of units');
      return;
    }

    // Check capacity limit for adding units
    if (action === 'add') {
      const currentUnits = bloodInventory[bloodType] || 0;
      const newTotal = currentUnits + unitsNum;

      if (newTotal > 100) {
        const availableSpace = 100 - currentUnits;
        setResult(`❌ Cannot add ${unitsNum} units to ${bloodType}. Current: ${currentUnits} units. Maximum capacity: 100 units. Available space: ${availableSpace} units.`);
        return;
      }
    }

    setBloodInventory(prev => {
      const newInventory = { ...prev };
      if (action === 'add') {
        newInventory[bloodType] += unitsNum;
      } else {
        newInventory[bloodType] = Math.max(0, newInventory[bloodType] - unitsNum);
      }

      localStorage.setItem('bloodInventory', JSON.stringify(newInventory));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('bloodInventoryUpdated', {
        detail: { newInventory, bloodType, action, units: unitsNum }
      }));

      return newInventory;
    });

    setResult(`✅ Inventory updated: ${bloodType} ${action === 'add' ? '+' : '-'}${unitsNum} units`);
    setInventoryUpdate({ bloodType: '', units: '', action: 'add' });
  };

  // Add hospital
  const handleAddHospital = (e) => {
    e.preventDefault();

    if (!hospitalForm.name || !hospitalForm.address || !hospitalForm.phone || !hospitalForm.state) {
      setResult('❌ Please fill all required fields (Name, Address, Phone, State)');
      return;
    }

    const newHospital = {
      id: Date.now(),
      ...hospitalForm,
      addedAt: new Date().toISOString(),
      addedBy: userEmail
    };

    const updatedHospitals = [...hospitals, newHospital];
    setHospitals(updatedHospitals);
    localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));

    setResult(`✅ Hospital "${hospitalForm.name}" added successfully!`);
    setHospitalForm({
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      emergencyContact: '',
      bloodTypes: [],
      isEmergency: false
    });
  };

  // Update emergency message
  const handleEmergencyUpdate = (e) => {
    e.preventDefault();

    const emergencyData = {
      message: emergencyMessage,
      active: emergencyActive,
      updatedAt: new Date().toISOString(),
      updatedBy: userEmail
    };

    localStorage.setItem('emergencyMessage', JSON.stringify(emergencyData));
    setResult(`✅ Emergency message ${emergencyActive ? 'activated' : 'deactivated'} successfully!`);
  };

  // Handle urgent blood request submission
  const handleUrgentBloodSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!urgentBloodForm.hospital || !urgentBloodForm.location || !urgentBloodForm.bloodType ||
        !urgentBloodForm.unitsNeeded || !urgentBloodForm.priority || !urgentBloodForm.contact ||
        !urgentBloodForm.reason || !urgentBloodForm.deadline) {
      setResult('❌ Please fill all required fields for urgent blood request');
      return;
    }

    // Create new urgent request
    const newUrgentRequest = {
      id: Date.now(),
      hospital: urgentBloodForm.hospital,
      location: urgentBloodForm.location,
      bloodType: urgentBloodForm.bloodType,
      unitsNeeded: parseInt(urgentBloodForm.unitsNeeded),
      priority: urgentBloodForm.priority,
      contact: urgentBloodForm.contact,
      reason: urgentBloodForm.reason,
      deadline: urgentBloodForm.deadline,
      timePosted: getTimeAgo(new Date()),
      createdAt: new Date().toISOString(),
      createdBy: userEmail
    };

    // Get existing urgent requests
    const existingRequests = JSON.parse(localStorage.getItem('urgentBloodRequests') || '[]');

    // Add new request
    const updatedRequests = [...existingRequests, newUrgentRequest];

    // Save to localStorage
    localStorage.setItem('urgentBloodRequests', JSON.stringify(updatedRequests));

    // Update state
    setUrgentRequests(updatedRequests);

    // Reset form
    setUrgentBloodForm({
      hospital: '',
      location: '',
      bloodType: '',
      unitsNeeded: '',
      priority: '',
      contact: '',
      reason: '',
      deadline: ''
    });

    setResult(`✅ Urgent blood request created successfully for ${urgentBloodForm.hospital}!`);
  };

  // Handle delete urgent request
  const handleDeleteUrgentRequest = (requestId) => {
    const existingRequests = JSON.parse(localStorage.getItem('urgentBloodRequests') || '[]');
    const updatedRequests = existingRequests.filter(req => req.id !== requestId);

    localStorage.setItem('urgentBloodRequests', JSON.stringify(updatedRequests));
    setUrgentRequests(updatedRequests);

    setResult('✅ Urgent blood request removed successfully!');
  };

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Helper function to get remaining time until expiry
  const getRemainingTime = (createdAt, deadline) => {
    if (!createdAt) return 'Unknown';

    const now = new Date();
    const createdTime = new Date(createdAt);
    const deadlineHours = parseInt(deadline.match(/\d+/)?.[0] || '24');
    const expiryTime = new Date(createdTime.getTime() + (deadlineHours * 60 * 60 * 1000));

    const remainingMs = expiryTime - now;

    if (remainingMs <= 0) {
      return 'Expired';
    }

    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    if (remainingHours > 0) {
      return `${remainingHours}h ${remainingMinutes}m left`;
    } else {
      return `${remainingMinutes}m left`;
    }
  };

  // Get dashboard statistics
  const getDashboardStats = () => {
    const totalRequests = allRequests.length;
    const pendingRequests = allRequests.filter(req => req.status === 'pending').length;
    const completedRequests = allRequests.filter(req => req.status === 'completed').length;
    const totalBloodUnits = Object.values(bloodInventory).reduce((sum, units) => sum + units, 0);
    const lowStockTypes = Object.entries(bloodInventory).filter(([bloodType, units]) => units < 20);

    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      totalBloodUnits,
      lowStockTypes
    };
  };

  // Redirect to login if not authenticated as admin
  if (!isAuthenticated) {
    return (
      <div className="admin-panel-page">
        <div className="admin-login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>🔐 Admin Access Required</h2>
              <p>Please login with admin credentials to access the panel</p>
            </div>

            <div className="admin-redirect">
              <div className="redirect-info">
                <h3>📋 Admin Login Instructions:</h3>
                <div className="credentials-info">
                  <p><strong>Email:</strong> admin@gmail.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
                <p>Use these credentials on the login page to access the admin panel.</p>
              </div>

              <div className="redirect-buttons">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="login-redirect-btn"
                >
                  🔓 Go to Login Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="home-redirect-btn"
                >
                  🏠 Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();

  return (
    <div className="admin-panel-page">
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <button
              className="hamburger-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="admin-logo">🏥 <span>Blood Bank Admin</span></div>
          </div>
          <div className="admin-header-right">
            <span className="admin-welcome">Welcome, {userEmail}</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 LOGOUT
            </button>
          </div>
        </div>

        {/* Admin Layout with Sidebar Menu */}
        <div className="admin-layout">
          {/* Sidebar Menu */}
          <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-menu">
              <h3>📋 Menu</h3>
              <ul className="menu-items">
                <li>
                  <button
                    className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    📊 Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`menu-item ${activeTab === 'manage-items' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage-items')}
                  >
                    📋 Manage Items
                  </button>
                </li>
                <li>
                  <button
                    className={`menu-item ${activeTab === 'blood-inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blood-inventory')}
                  >
                    🩸 Blood Inventory
                  </button>
                </li>
                <li>
                  <button
                    className={`menu-item ${activeTab === 'update-status' ? 'active' : ''}`}
                    onClick={() => setActiveTab('update-status')}
                  >
                    🔄 Update Status
                  </button>
                </li>
                <li>
                  <button
                    className={`menu-item ${activeTab === 'hospital-management' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hospital-management')}
                  >
                    🏥 Hospital Management
                  </button>
                </li>
                <li>
                  <button
                    className={`menu-item ${activeTab === 'emergency-alerts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('emergency-alerts')}
                  >
                    🚨 Emergency Alerts
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="admin-main-content">

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab">
                <h2>📊 Dashboard Overview</h2>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <h3>{stats.totalRequests}</h3>
                      <p>Total Requests</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <h3>{stats.pendingRequests}</h3>
                      <p>Pending Requests</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>{stats.completedRequests}</h3>
                      <p>Completed</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🩸</div>
                    <div className="stat-info">
                      <h3>{stats.totalBloodUnits}</h3>
                      <p>Total Blood Units</p>
                    </div>
                  </div>
                </div>

                {stats.lowStockTypes.length > 0 && (
                  <div className="alert-section">
                    <h3>⚠️ Low Stock Alert</h3>
                    <div className="low-stock-alerts">
                      {stats.lowStockTypes.map(([type, units]) => (
                        <div key={type} className="alert-item">
                          <span className="blood-type">{type}</span>
                          <span className="units">{units} units</span>
                          <span className="status low">Low Stock</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="recent-requests">
                  <h3>📋 Recent Requests</h3>
                  <div className="requests-list">
                    {allRequests.slice(-5).reverse().map((request) => (
                      <div key={request.referenceNumber} className="request-item">
                        <div className="request-info">
                          <span className="ref-number">{request.referenceNumber}</span>
                          <span className="request-type">{request.type}</span>
                          <span className="blood-group">{request.bloodGroup}</span>
                        </div>
                        <span className={`status-badge ${request.status}`}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage-items' && (
              <div className="manage-items-tab">
                <h2>📋 Manage Items</h2>

                <div className="requests-header">
                  <div className="filters">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Types</option>
                      <option value="donation">Donations</option>
                      <option value="request">Requests</option>
                    </select>
                  </div>
                </div>

                <div className="requests-table">
                  {filteredRequests.length === 0 ? (
                    <div className="no-requests">
                      <p>No requests found matching the current filters.</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Blood Group</th>
                            <th>Hospital</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.map((request) => (
                            <tr key={request.referenceNumber}>
                              <td className="ref-cell">{request.referenceNumber}</td>
                              <td>{request.name}</td>
                              <td>
                                <span className={`type-badge ${request.type}`}>
                                  {request.type}
                                </span>
                              </td>
                              <td className="blood-group-cell">{request.bloodGroup}</td>
                              <td>{request.hospital}</td>
                              <td>
                                <span className={`status-badge ${request.status}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                              <td>
                                <div className="contact-info">
                                  <div>📧 {request.email}</div>
                                  <div>📱 {request.phone}</div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blood-inventory' && (
              <div className="inventory-tab">
                <h2>🩸 Blood Inventory Management</h2>

                <div className="inventory-grid">
                  {Object.entries(bloodInventory).map(([bloodType, units]) => (
                    <div key={bloodType} className="inventory-card">
                      <div className="blood-type-header">
                        <h3>{bloodType}</h3>
                        <span className={`stock-level ${
                          units >= 100 ? 'full' :
                          units < 20 ? 'low' :
                          units < 40 ? 'medium' :
                          units < 80 ? 'good' : 'high'
                        }`}>
                          {units >= 100 ? 'Full' :
                           units < 20 ? 'Low' :
                           units < 40 ? 'Medium' :
                           units < 80 ? 'Good' : 'High'}
                        </span>
                      </div>
                      <div className="units-display">
                        <span className="units-number">{units}</span>
                        <span className="units-label">/ 100 units</span>
                      </div>
                      <div className="stock-bar">
                        <div
                          className="stock-fill"
                          style={{
                            width: `${Math.min((units / 100) * 100, 100)}%`,
                            backgroundColor:
                              units >= 100 ? '#8e44ad' :
                              units < 20 ? '#e74c3c' :
                              units < 40 ? '#f39c12' :
                              units < 80 ? '#27ae60' : '#2980b9'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="inventory-update-form">
                  <h3>📦 Update Inventory</h3>
                  <form onSubmit={handleInventoryUpdate} className="update-form">
                    <div className="form-row">
                      <select
                        value={inventoryUpdate.bloodType}
                        onChange={(e) => setInventoryUpdate(prev => ({...prev, bloodType: e.target.value}))}
                        required
                      >
                        <option value="">Select Blood Type</option>
                        {Object.keys(bloodInventory).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Units"
                        value={inventoryUpdate.units}
                        onChange={(e) => setInventoryUpdate(prev => ({...prev, units: e.target.value}))}
                        min="1"
                        required
                      />

                      <select
                        value={inventoryUpdate.action}
                        onChange={(e) => setInventoryUpdate(prev => ({...prev, action: e.target.value}))}
                      >
                        <option value="add">Add Units</option>
                        <option value="remove">Remove Units</option>
                      </select>

                      <button type="submit" className="update-inventory-btn">
                        📦 Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'update-status' && (
              <div className="status-tab">
                <h2>🔄 Update Request Status</h2>

                <form onSubmit={handleUpdateStatus} className="status-form">
                  <div className="form-group">
                    <label htmlFor="referenceNumber">Reference Number *</label>
                    <input
                      type="text"
                      id="referenceNumber"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Enter reference number (e.g., REF-123456)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newStatus">New Status *</label>
                    <select
                      id="newStatus"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Optional message for the user"
                      rows="3"
                    />
                  </div>

                  <button type="submit" className="update-btn" disabled={loading}>
                    {loading ? '🔄 Updating...' : '📤 Update Status'}
                  </button>
                </form>

                <div className="status-info">
                  <h3>📋 Status Options</h3>
                  <div className="status-grid">
                    {statusOptions.map(option => (
                      <div key={option.value} className="status-item">
                        <span
                          className="status-dot"
                          style={{ backgroundColor: option.color }}
                        ></span>
                        <div>
                          <strong>{option.label}:</strong>
                          <p>
                            {option.value === 'pending' && 'Initial status when request is submitted'}
                            {option.value === 'approved' && 'Request has been reviewed and approved'}
                            {option.value === 'accepted' && 'Hospital has accepted the request'}
                            {option.value === 'rejected' && 'Request has been declined'}
                            {option.value === 'completed' && 'Process has been completed successfully'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hospital-management' && (
              <div className="hospital-management-tab">
                <h2>🏥 Hospital Management</h2>

                <div className="hospital-form-section">
                  <h3>➕ Add New Hospital</h3>
                  <form onSubmit={handleAddHospital} className="hospital-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hospitalName">Hospital Name *</label>
                        <input
                          type="text"
                          id="hospitalName"
                          value={hospitalForm.name}
                          onChange={(e) => setHospitalForm(prev => ({...prev, name: e.target.value}))}
                          placeholder="Enter hospital name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="hospitalPhone">Phone Number *</label>
                        <input
                          type="tel"
                          id="hospitalPhone"
                          value={hospitalForm.phone}
                          onChange={(e) => setHospitalForm(prev => ({...prev, phone: e.target.value}))}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hospitalAddress">Address *</label>
                        <input
                          type="text"
                          id="hospitalAddress"
                          value={hospitalForm.address}
                          onChange={(e) => setHospitalForm(prev => ({...prev, address: e.target.value}))}
                          placeholder="Enter hospital address"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="hospitalState">State *</label>
                        <select
                          id="hospitalState"
                          value={hospitalForm.state}
                          onChange={(e) => setHospitalForm(prev => ({...prev, state: e.target.value}))}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Assam">Assam</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="Goa">Goa</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hospitalCity">City</label>
                        <input
                          type="text"
                          id="hospitalCity"
                          value={hospitalForm.city}
                          onChange={(e) => setHospitalForm(prev => ({...prev, city: e.target.value}))}
                          placeholder="Enter city"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="hospitalEmail">Email</label>
                        <input
                          type="email"
                          id="hospitalEmail"
                          value={hospitalForm.email}
                          onChange={(e) => setHospitalForm(prev => ({...prev, email: e.target.value}))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="emergencyContact">Emergency Contact</label>
                        <input
                          type="tel"
                          id="emergencyContact"
                          value={hospitalForm.emergencyContact}
                          onChange={(e) => setHospitalForm(prev => ({...prev, emergencyContact: e.target.value}))}
                          placeholder="Emergency contact number"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={hospitalForm.isEmergency}
                          onChange={(e) => setHospitalForm(prev => ({...prev, isEmergency: e.target.checked}))}
                        />
                        Emergency Hospital (24/7 Blood Bank)
                      </label>
                    </div>

                    <button type="submit" className="add-hospital-btn">
                      🏥 Add Hospital
                    </button>
                  </form>
                </div>

                <div className="hospitals-list-section">
                  <h3>📋 Registered Hospitals ({hospitals.length})</h3>
                  {hospitals.length === 0 ? (
                    <div className="no-hospitals">
                      <p>No hospitals registered yet.</p>
                    </div>
                  ) : (
                    <div className="hospitals-grid">
                      {hospitals.map((hospital) => (
                        <div key={hospital.id} className="hospital-card">
                          <div className="hospital-header">
                            <h4>{hospital.name}</h4>
                            {hospital.isEmergency && (
                              <span className="emergency-badge">🚨 Emergency</span>
                            )}
                          </div>
                          <div className="hospital-details">
                            <p><strong>📍 Address:</strong> {hospital.address}</p>
                            {hospital.state && <p><strong>🗺️ State:</strong> {hospital.state}</p>}
                            {hospital.city && <p><strong>🏙️ City:</strong> {hospital.city}</p>}
                            <p><strong>📞 Phone:</strong> {hospital.phone}</p>
                            {hospital.email && <p><strong>📧 Email:</strong> {hospital.email}</p>}
                            {hospital.emergencyContact && (
                              <p><strong>🚨 Emergency:</strong> {hospital.emergencyContact}</p>
                            )}
                            <p><strong>📅 Added:</strong> {new Date(hospital.addedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'emergency-alerts' && (
              <div className="emergency-alerts-tab">
                <h2>🚨 Emergency Alerts Management</h2>

                {/* Emergency Message Section */}
                <div className="emergency-form-section">
                  <h3>📢 Emergency Message</h3>
                  <form onSubmit={handleEmergencyUpdate} className="emergency-form">
                    <div className="form-group">
                      <label htmlFor="emergencyMessage">Emergency Message</label>
                      <textarea
                        id="emergencyMessage"
                        value={emergencyMessage}
                        onChange={(e) => setEmergencyMessage(e.target.value)}
                        placeholder="Enter emergency message for users..."
                        rows="4"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={emergencyActive}
                          onChange={(e) => setEmergencyActive(e.target.checked)}
                        />
                        Activate Emergency Alert
                      </label>
                    </div>

                    <button type="submit" className="update-emergency-btn">
                      🚨 Update Emergency Alert
                    </button>
                  </form>
                </div>

                <div className="emergency-preview">
                  <h3>👁️ Preview</h3>
                  {emergencyActive && emergencyMessage ? (
                    <div className="emergency-alert-preview">
                      <div className="alert-banner">
                        🚨 EMERGENCY ALERT 🚨
                      </div>
                      <p>{emergencyMessage}</p>
                    </div>
                  ) : (
                    <div className="no-emergency">
                      <p>No active emergency alert</p>
                    </div>
                  )}
                </div>

                {/* Urgent Blood Requests Section */}
                <div className="urgent-blood-section">
                  <h3>🩸 Urgent Blood Requests</h3>
                  <form onSubmit={handleUrgentBloodSubmit} className="urgent-blood-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="urgentHospital">Hospital Name *</label>
                        <input
                          type="text"
                          id="urgentHospital"
                          value={urgentBloodForm.hospital}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, hospital: e.target.value})}
                          placeholder="Enter hospital name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="urgentLocation">Location *</label>
                        <input
                          type="text"
                          id="urgentLocation"
                          value={urgentBloodForm.location}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, location: e.target.value})}
                          placeholder="Enter city/location"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="urgentBloodType">Blood Type *</label>
                        <select
                          id="urgentBloodType"
                          value={urgentBloodForm.bloodType}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, bloodType: e.target.value})}
                          required
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="urgentUnits">Units Needed *</label>
                        <input
                          type="number"
                          id="urgentUnits"
                          value={urgentBloodForm.unitsNeeded}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, unitsNeeded: e.target.value})}
                          placeholder="Number of units"
                          min="1"
                          max="50"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="urgentPriority">Priority Level *</label>
                        <select
                          id="urgentPriority"
                          value={urgentBloodForm.priority}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, priority: e.target.value})}
                          required
                        >
                          <option value="">Select Priority</option>
                          <option value="Critical">🚨 Critical</option>
                          <option value="High">⚠️ High</option>
                          <option value="Medium">🟡 Medium</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="urgentContact">Contact Number *</label>
                        <input
                          type="tel"
                          id="urgentContact"
                          value={urgentBloodForm.contact}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, contact: e.target.value})}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="urgentReason">Reason for Request *</label>
                        <input
                          type="text"
                          id="urgentReason"
                          value={urgentBloodForm.reason}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, reason: e.target.value})}
                          placeholder="e.g., Emergency Surgery, Cancer Treatment"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="urgentDeadline">Deadline *</label>
                        <select
                          id="urgentDeadline"
                          value={urgentBloodForm.deadline}
                          onChange={(e) => setUrgentBloodForm({...urgentBloodForm, deadline: e.target.value})}
                          required
                        >
                          <option value="">Select Deadline</option>
                          <option value="Within 2 hours">Within 2 hours</option>
                          <option value="Within 4 hours">Within 4 hours</option>
                          <option value="Within 6 hours">Within 6 hours</option>
                          <option value="Within 12 hours">Within 12 hours</option>
                          <option value="Within 24 hours">Within 24 hours</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="submit-urgent-btn">
                      🩸 Create Urgent Blood Request
                    </button>
                  </form>
                </div>

                {/* Current Urgent Requests */}
                <div className="current-urgent-requests">
                  <h3>📋 Current Urgent Requests</h3>
                  {urgentRequests.length === 0 ? (
                    <div className="no-requests">
                      <p>No urgent blood requests currently active</p>
                    </div>
                  ) : (
                    <div className="urgent-requests-list">
                      {urgentRequests.map((request) => (
                        <div key={request.id} className="urgent-request-card">
                          <div className="request-header">
                            <h4>{request.hospital}</h4>
                            <span className={`priority-badge priority-${request.priority.toLowerCase()}`}>
                              {request.priority}
                            </span>
                          </div>
                          <div className="request-details">
                            <p><strong>Location:</strong> {request.location}</p>
                            <p><strong>Blood Type:</strong> {request.bloodType}</p>
                            <p><strong>Units:</strong> {request.unitsNeeded}</p>
                            <p><strong>Reason:</strong> {request.reason}</p>
                            <p><strong>Deadline:</strong> {request.deadline}</p>
                            <p><strong>Contact:</strong> {request.contact}</p>
                            <p><strong>Posted:</strong> {request.timePosted}</p>
                            <p><strong>Expires:</strong> <span style={{color: getRemainingTime(request.createdAt, request.deadline) === 'Expired' ? '#e74c3c' : '#27ae60'}}>{getRemainingTime(request.createdAt, request.deadline)}</span></p>
                          </div>
                          <button
                            onClick={() => handleDeleteUrgentRequest(request.id)}
                            className="delete-request-btn"
                          >
                            🗑️ Remove Request
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {result && (
              <div className={`result-message ${result.includes('✅') ? 'success' : 'error'}`}>
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
