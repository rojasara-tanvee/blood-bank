const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// In-memory storage for requests (in production, use a proper database)
let requestsDatabase = [];
let requestCounter = 100000;

app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tanveerojasara@gmail.com",
      pass: "zvadydzjuqbjpuco", // ✅ NO SPACES — copy the 16-char app password without spaces
    },
  });

  const mailOptions = {
    from: "tanveerojasara@gmail.com", // ✅ MUST match the user above
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email); // ✅ Show in terminal
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Email error:", error); // ✅ Print full error
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Helper function to send notifications
const sendNotification = async (email, phone, subject, message, smsMessage) => {
  console.log("📧 Attempting to send notifications...");

  // Send Email
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: "tanveerojasara@gmail.com",
        pass: "zvadydzjuqbjpuco",
      },
    });

    const mailOptions = {
      from: "tanveerojasara@gmail.com",
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Email error (continuing anyway):", error.message);
    // Don't throw error - continue with request processing
  }

  // SMS simulation (in production, integrate with SMS service like Twilio)
  console.log(`📱 SMS to ${phone}: ${smsMessage}`);
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

    // Send confirmation email and SMS
    const emailSubject = `Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailMessage = `
      <h2>🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been submitted successfully.</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>📋 Request Details:</h3>
        <p><strong>Reference Number:</strong> ${referenceNumber}</p>
        <p><strong>Hospital:</strong> ${hospital}</p>
        <p><strong>Blood Group:</strong> ${bloodGroup}</p>
        <p><strong>Status:</strong> Pending Review</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>You will receive updates via email and SMS when your request status changes.</p>
      <p>Track your request: <a href="http://localhost:3000/track-request">Click here to track</a></p>
      <p>Thank you for using our blood bank service!</p>
    `;
    const smsMessage = `Blood ${type} confirmed! Ref: ${referenceNumber}. Status: Pending. Track at: http://localhost:3000/track-request`;

    await sendNotification(email, phoneNumber, emailSubject, emailMessage, smsMessage);

    console.log("✅ Request created successfully:", referenceNumber);

    res.status(201).json({
      success: true,
      referenceNumber,
      message: 'Request created successfully'
    });

  } catch (error) {
    console.error("Create request error:", error);
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

// Update request status (for admin/hospital use)
app.post("/update-status", async (req, res) => {
  try {
    const { referenceNumber, newStatus, message, adminKey } = req.body;

    // Simple admin authentication (in production, use proper authentication)
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

    // Send notification about status change
    const emailSubject = `Status Update: ${request.referenceNumber} - ${newStatus.toUpperCase()}`;
    const emailMessage = `
      <h2>🔄 Status Update</h2>
      <p>Dear ${request.name},</p>
      <p>Your ${request.type === 'donation' ? 'blood donation' : 'blood request'} status has been updated.</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>📋 Updated Details:</h3>
        <p><strong>Reference Number:</strong> ${request.referenceNumber}</p>
        <p><strong>Previous Status:</strong> ${oldStatus}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      </div>
      <p>Track your request: <a href="http://localhost:3000/track-request">Click here to track</a></p>
    `;
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

app.listen(PORT, () => {
  console.log(`🚀 Blood Bank Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: Enabled`);
  console.log(`📱 SMS notifications: Simulated`);
  console.log(`🩸 Ready to accept blood donation and request submissions!`);
});
