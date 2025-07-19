import React, { useState, useEffect } from 'react';

const DebugRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    setRequests(storedRequests);
  }, []);

  const clearAllRequests = () => {
    localStorage.removeItem('bloodRequests');
    setRequests([]);
    alert('All requests cleared!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Debug: Stored Requests</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          🔄 Refresh
        </button>
        <button 
          onClick={clearAllRequests}
          style={{ padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          🗑️ Clear All Requests
        </button>
      </div>

      <p><strong>Total Requests Stored:</strong> {requests.length}</p>

      {requests.length === 0 ? (
        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #dee2e6' }}>
          <p>❌ No requests found in localStorage</p>
          <p>Try submitting a form first, then come back here to see the stored data.</p>
        </div>
      ) : (
        <div>
          {requests.map((request, index) => (
            <div key={index} style={{ 
              margin: '10px 0', 
              padding: '15px', 
              border: '1px solid #ccc', 
              borderRadius: '5px',
              background: '#f9f9f9'
            }}>
              <h4>Request #{index + 1}</h4>
              <p><strong>Reference Number:</strong> {request.referenceNumber}</p>
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Email:</strong> {request.email}</p>
              <p><strong>Phone:</strong> {request.phone}</p>
              <p><strong>Contact:</strong> {request.contact}</p>
              <p><strong>Hospital:</strong> {request.hospital}</p>
              <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
              <p><strong>Type:</strong> {request.type}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleString()}</p>
              
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📋 Full Data (Click to expand)</summary>
                <pre style={{ 
                  background: '#f1f1f1', 
                  padding: '10px', 
                  borderRadius: '3px', 
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(request, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>💡 How to Use This Debug Page:</h3>
        <ol>
          <li>Submit a form (donation or request)</li>
          <li>Come back to this page and click "Refresh"</li>
          <li>You should see your request data here</li>
          <li>Copy the exact reference number, phone, and email</li>
          <li>Use those exact values in the tracking form</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugRequests;
