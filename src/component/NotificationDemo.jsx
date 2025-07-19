import React, { useState } from 'react';

const NotificationDemo = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    if (!email || !phone) {
      alert('Please enter both email and phone number');
      return;
    }

    setLoading(true);
    setResult('Sending notifications...');

    try {
      const response = await fetch('http://localhost:5000/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Test User",
          email: email,
          contact: phone,
          hospital: "Demo Hospital",
          bloodGroup: "A+",
          type: "donation",
          address: "Demo Address"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ NOTIFICATIONS SENT SUCCESSFULLY!

📧 EMAIL NOTIFICATION:
To: ${email}
Subject: 🩸 Blood Donation Confirmation - ${data.referenceNumber}
Status: ${data.notifications.email.success ? 'SENT' : 'FAILED'}

📱 SMS NOTIFICATION:
To: ${phone}
Message: Blood donation confirmed! Reference: ${data.referenceNumber}
Status: ${data.notifications.sms.success ? 'SENT' : 'FAILED'}

🎫 REFERENCE NUMBER: ${data.referenceNumber}

💡 Check your email inbox and the server console for detailed output!`);
      } else {
        setResult(`❌ NOTIFICATION FAILED: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ CONNECTION ERROR: ${error.message}
      
🔍 Make sure the notification server is running:
1. Open terminal/command prompt
2. Navigate to your project folder
3. Run: node backend/simple-notification-server.js
4. Look for "Server running" message`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📧📱 Notification System Demo</h1>
      
      <div style={{ background: '#f0f8ff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>🧪 Test Email & SMS Notifications</h3>
        <p>Enter your details to test the notification system:</p>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📧 Your Email Address:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📱 Your Phone Number:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button
          onClick={sendTestNotification}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '📤 Sending...' : '📧📱 Send Test Notifications'}
        </button>
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #dee2e6',
        minHeight: '200px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {result || 'Click the button above to test notifications...'}
      </div>

      <div style={{ marginTop: '20px', background: '#fff3cd', padding: '15px', borderRadius: '5px' }}>
        <h4>💡 How to Check if Notifications Work:</h4>
        <ol>
          <li><strong>Start the server:</strong> Run <code>node backend/simple-notification-server.js</code></li>
          <li><strong>Enter your real email and phone</strong> in the form above</li>
          <li><strong>Click "Send Test Notifications"</strong></li>
          <li><strong>Check the server console</strong> - you'll see detailed notification output</li>
          <li><strong>Check your email</strong> - for real email delivery (if configured)</li>
          <li><strong>Check SMS logs</strong> - in the server console</li>
        </ol>
        
        <p><strong>Note:</strong> Currently using simulated notifications. Check the server console to see the email and SMS content that would be sent to users.</p>
      </div>
    </div>
  );
};

export default NotificationDemo;
