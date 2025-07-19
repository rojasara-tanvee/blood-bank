const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// In-memory storage for requests
let requestsDatabase = [];
let requestCounter = 100000;

// Simple notification function (no email for now)
const sendNotification = async (email, phone, subject, message, smsMessage) => {
  console.log("📧 Email notification (simulated):", { to: email, subject });
  console.log("📱 SMS notification (simulated):", { to: phone, message: smsMessage });
};

// Create new request
app.post("/create-request", async (req, res) => {
  console.log("📥 Received create-request:", req.body);
  
  try {
    const { name, email, phone, contact, hospital, bloodGroup, type, address, additionalInfo } = req.body;
    
    // Handle both phone and contact field names
    const phoneNumber = phone || contact;
    
    console.log("📋 Processing request:", { name, email, phoneNumber, hospital, bloodGroup, type });
    
    // Validate required fields
    if (!name || !email || !phoneNumber || !hospital || !bloodGroup || !type) {
      return res.status(400).json({ 
        error: "Missing required fields. Please fill in all required information." 
      });
    }
    
    const referenceNumber = `REF-${requestCounter++}`;
    const newRequest = {
      id: Date.now(),
      referenceNumber,
      name,
      email,
      phone: phoneNumber,
      hospital,
      bloodGroup,
      type, // 'donation' or 'request'
      address,
      additionalInfo: additionalInfo || {},
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          status: 'pending',
          date: new Date(),
          message: 'Request submitted successfully'
        }
      ]
    };

    requestsDatabase.push(newRequest);

    // Send notifications (simulated)
    const emailSubject = `Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailMessage = `Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been submitted successfully.`;
    const smsMessage = `Blood ${type} confirmed! Ref: ${referenceNumber}. Status: Pending.`;

    await sendNotification(email, phoneNumber, emailSubject, emailMessage, smsMessage);

    console.log("✅ Request created successfully:", referenceNumber);

    res.status(201).json({
      success: true,
      referenceNumber,
      message: 'Request created successfully'
    });

  } catch (error) {
    console.error("❌ Create request error:", error);
    res.status(500).json({ 
      error: "Failed to create request. Please try again later.",
      details: error.message 
    });
  }
});

// Track request
app.post("/track-request", async (req, res) => {
  try {
    const { referenceNumber, contactNumber, email } = req.body;

    const request = requestsDatabase.find(req => 
      req.referenceNumber === referenceNumber && 
      (req.phone === contactNumber || req.email === email)
    );

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found. Please check your reference number and contact details." 
      });
    }

    res.status(200).json(request);

  } catch (error) {
    console.error("Track request error:", error);
    res.status(500).json({ error: "Failed to track request" });
  }
});

// Update request status (for admin use)
app.post("/update-status", async (req, res) => {
  try {
    const { referenceNumber, newStatus, message, adminKey } = req.body;

    // Simple admin authentication
    if (adminKey !== "admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestIndex = requestsDatabase.findIndex(req => req.referenceNumber === referenceNumber);
    
    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requestsDatabase[requestIndex];
    const oldStatus = request.status;
    
    // Update request
    request.status = newStatus;
    request.updatedAt = new Date();
    request.timeline.push({
      status: newStatus,
      date: new Date(),
      message: message || `Status updated to ${newStatus}`
    });

    requestsDatabase[requestIndex] = request;

    // Send notification about status change (simulated)
    const emailSubject = `Status Update: ${request.referenceNumber} - ${newStatus.toUpperCase()}`;
    const emailMessage = `Your ${request.type === 'donation' ? 'blood donation' : 'blood request'} status has been updated to ${newStatus}.`;
    const smsMessage = `Status Update: ${request.referenceNumber} - ${newStatus.toUpperCase()}. ${message || ''}`;

    await sendNotification(request.email, request.phone, emailSubject, emailMessage, smsMessage);

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      request
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Blood Bank API is running!", 
    endpoints: ["/create-request", "/track-request", "/update-status"],
    requests: requestsDatabase.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Blood Bank Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: Simulated (no actual emails sent)`);
  console.log(`📱 SMS notifications: Simulated`);
  console.log(`🩸 Ready to accept blood donation and request submissions!`);
  console.log(`🔍 Visit http://localhost:${PORT} to check server status`);
});
