const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// In-memory storage for requests
let requestsDatabase = [];
let requestCounter = 100000;

// Simple email simulation (for testing)
const sendEmailNotification = async (email, subject, content) => {
  try {
    console.log("\n📧 EMAIL NOTIFICATION SENT:");
    console.log("═══════════════════════════════════");
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log("Content:");
    console.log(content);
    console.log("═══════════════════════════════════\n");
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: "Email sent successfully (simulated)" };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
};

// Simple SMS simulation
const sendSMSNotification = async (phone, message) => {
  try {
    console.log("\n📱 SMS NOTIFICATION SENT:");
    console.log("═══════════════════════════════════");
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log("═══════════════════════════════════\n");
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, message: "SMS sent successfully (simulated)" };
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    return { success: false, error: error.message };
  }
};

// Create new request with notifications
app.post("/create-request", async (req, res) => {
  console.log("\n🩸 NEW REQUEST RECEIVED:");
  console.log("═══════════════════════════════════");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("═══════════════════════════════════");
  
  try {
    const { name, email, phone, contact, hospital, bloodGroup, type, address, additionalInfo } = req.body;
    
    // Handle both phone and contact field names
    const phoneNumber = phone || contact;
    
    // Validate required fields
    if (!name || !email || !phoneNumber || !hospital || !bloodGroup || !type) {
      console.log("❌ Validation failed - missing required fields");
      return res.status(400).json({ 
        error: "Missing required fields. Please fill in all required information." 
      });
    }
    
    const referenceNumber = `REF-${requestCounter++}`;
    console.log(`\n🎫 Generated Reference Number: ${referenceNumber}`);
    
    const newRequest = {
      id: Date.now(),
      referenceNumber,
      name,
      email,
      phone: phoneNumber,
      hospital,
      bloodGroup,
      type,
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
    console.log(`✅ Request stored in database. Total requests: ${requestsDatabase.length}`);

    // Prepare email content
    const emailSubject = `🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailContent = `
Dear ${name},

Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been submitted successfully!

📋 REFERENCE NUMBER: ${referenceNumber}
🏥 Hospital: ${hospital}
🩸 Blood Group: ${bloodGroup}
📅 Submitted: ${new Date().toLocaleString()}

Please save your reference number for tracking.
Track your request at: http://localhost:3000/track-request

Thank you for using our blood bank service!
    `;

    // Prepare SMS content
    const smsMessage = `🩸 Blood ${type} confirmed! Reference: ${referenceNumber}. Hospital: ${hospital}. Track: http://localhost:3000/track-request`;

    // Send notifications
    console.log("\n📤 Sending notifications...");
    const emailResult = await sendEmailNotification(email, emailSubject, emailContent);
    const smsResult = await sendSMSNotification(phoneNumber, smsMessage);

    console.log(`\n✅ REQUEST PROCESSED SUCCESSFULLY!`);
    console.log(`Reference: ${referenceNumber}`);
    console.log(`Email Status: ${emailResult.success ? 'SENT' : 'FAILED'}`);
    console.log(`SMS Status: ${smsResult.success ? 'SENT' : 'FAILED'}`);

    res.status(201).json({
      success: true,
      referenceNumber,
      message: 'Request created successfully',
      notifications: {
        email: emailResult,
        sms: smsResult
      }
    });

  } catch (error) {
    console.error("\n❌ REQUEST PROCESSING ERROR:", error);
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
    console.log(`\n🔍 Tracking request: ${referenceNumber}`);

    const request = requestsDatabase.find(req => 
      req.referenceNumber === referenceNumber && 
      (req.phone === contactNumber || req.email === email)
    );

    if (!request) {
      console.log("❌ Request not found");
      return res.status(404).json({ 
        error: "Request not found. Please check your reference number and contact details." 
      });
    }

    console.log("✅ Request found and returned");
    res.status(200).json(request);

  } catch (error) {
    console.error("Track request error:", error);
    res.status(500).json({ error: "Failed to track request" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Blood Bank Simple Notification Server is running!", 
    features: ["Email notifications (simulated)", "SMS notifications (simulated)", "Request tracking"],
    requests: requestsDatabase.length,
    status: "✅ WORKING"
  });
});

// Show all requests (for debugging)
app.get("/debug/requests", (req, res) => {
  res.json({
    total: requestsDatabase.length,
    requests: requestsDatabase
  });
});

app.listen(PORT, () => {
  console.log("\n🚀 BLOOD BANK SIMPLE NOTIFICATION SERVER");
  console.log("═══════════════════════════════════════════");
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📧 Email: SIMULATED (console output)`);
  console.log(`📱 SMS: SIMULATED (console output)`);
  console.log(`🩸 Status: READY FOR REQUESTS`);
  console.log("═══════════════════════════════════════════");
  console.log("\n💡 How to test:");
  console.log("1. Submit a form on your website");
  console.log("2. Watch this console for notifications");
  console.log("3. Check the detailed output above");
  console.log("\n🔍 Debug URL: http://localhost:5000/debug/requests");
  console.log("📊 Health Check: http://localhost:5000");
  console.log("\n⏳ Waiting for requests...\n");
});
