import React, { useState } from 'react';

const SimpleTest = () => {
  const [result, setResult] = useState('');

  const testSubmitForm = () => {
    // Simulate form submission
    const referenceNumber = `REF-${Date.now().toString().slice(-6)}`;
    const testData = {
      referenceNumber,
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      contact: "1234567890",
      hospital: "Test Hospital",
      bloodGroup: "A+",
      type: "donation",
      address: "Test Address",
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    existingRequests.push(testData);
    localStorage.setItem('bloodRequests', JSON.stringify(existingRequests));

    setResult(`✅ Test form submitted!
Reference Number: ${referenceNumber}
Contact: 1234567890
Email: test@example.com

Now try tracking with these exact values.`);
  };

  const testTracking = () => {
    const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    
    if (existingRequests.length === 0) {
      setResult('❌ No requests found. Submit a test form first.');
      return;
    }

    const lastRequest = existingRequests[existingRequests.length - 1];
    setResult(`🔍 Last submitted request:
Reference: ${lastRequest.referenceNumber}
Name: ${lastRequest.name}
Email: ${lastRequest.email}
Phone: ${lastRequest.phone}
Contact: ${lastRequest.contact}

Use these exact values in the tracking form.`);
  };

  const clearAll = () => {
    localStorage.removeItem('bloodRequests');
    setResult('🗑️ All requests cleared.');
  };

  const showAll = () => {
    const existingRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    
    if (existingRequests.length === 0) {
      setResult('📋 No requests stored.');
      return;
    }

    let output = `📋 All stored requests (${existingRequests.length}):\n\n`;
    existingRequests.forEach((req, index) => {
      output += `${index + 1}. ${req.referenceNumber} - ${req.name} - ${req.email} - ${req.phone || req.contact}\n`;
    });

    setResult(output);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Simple Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testSubmitForm} style={buttonStyle}>
          1️⃣ Submit Test Form
        </button>
        <button onClick={testTracking} style={buttonStyle}>
          2️⃣ Show Last Request
        </button>
        <button onClick={showAll} style={buttonStyle}>
          3️⃣ Show All Requests
        </button>
        <button onClick={clearAll} style={{...buttonStyle, background: '#dc3545'}}>
          🗑️ Clear All
        </button>
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '5px',
        border: '1px solid #dee2e6',
        minHeight: '200px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace'
      }}>
        {result || 'Click a button above to test...'}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>📋 How to Use:</h3>
        <ol>
          <li><strong>Submit Test Form:</strong> Creates a test request with known values</li>
          <li><strong>Show Last Request:</strong> Shows the exact values to use for tracking</li>
          <li><strong>Go to Tracking:</strong> Use the exact values shown above</li>
          <li><strong>Should Work:</strong> Tracking should find your request</li>
        </ol>
        
        <p><strong>Tracking URL:</strong> <a href="/track-request" target="_blank">http://localhost:3000/track-request</a></p>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 15px',
  margin: '5px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default SimpleTest;
