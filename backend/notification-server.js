const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// In-memory storage for requests
let requestsDatabase = [];
let requestCounter = 100000;

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "tanveerojasara@gmail.com", // Your email
    pass: "zvadydzjuqbjpuco", // Your app password
  },
});

// Function to send email notification
const sendEmailNotification = async (email, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: "tanveerojasara@gmail.com",
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
};

// Function to send SMS notification (using a free SMS API or simulation)
const sendSMSNotification = async (phone, message) => {
  try {
    // For now, we'll simulate SMS sending
    // In production, you can integrate with Twilio, TextBelt, or other SMS services
    console.log(`📱 SMS to ${phone}: ${message}`);
    
    // Uncomment below to use a free SMS service like TextBelt
    /*
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone,
        message: message,
        key: 'textbelt' // Use 'textbelt' for free quota (1 SMS per day per IP)
      })
    });
    const result = await response.json();
    return result;
    */
    
    return { success: true, message: "SMS simulated successfully" };
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    return { success: false, error: error.message };
  }
};

// Create new request with notifications
app.post("/create-request", async (req, res) => {
  console.log("📥 Received create-request:", req.body);
  
  try {
    const { name, email, phone, contact, hospital, bloodGroup, type, address, additionalInfo } = req.body;
    
    // Handle both phone and contact field names
    const phoneNumber = phone || contact;
    
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

    // Prepare email content
    const emailSubject = `🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .ref-box { background: white; border: 2px solid #667eea; padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .ref-number { font-size: 24px; font-weight: bold; color: #000; font-family: 'Courier New', monospace; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been submitted successfully!</p>
            
            <div class="ref-box">
              <h3>📋 Your Reference Number</h3>
              <div class="ref-number">${referenceNumber}</div>
              <p><small>Save this number for tracking your request</small></p>
            </div>
            
            <div class="details">
              <h3>📋 Request Details:</h3>
              <p><strong>Hospital:</strong> ${hospital}</p>
              <p><strong>Blood Group:</strong> ${bloodGroup}</p>
              <p><strong>Type:</strong> ${type === 'donation' ? 'Blood Donation' : 'Blood Request'}</p>
              <p><strong>Status:</strong> Pending Review</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="details">
              <h3>📞 What's Next?</h3>
              ${type === 'donation' ? `
                <ul>
                  <li>🏥 Hospital staff will review your donation offer</li>
                  <li>📞 You'll receive a call within 2-4 hours</li>
                  <li>🩸 Donation eligibility will be confirmed</li>
                  <li>📅 Donation appointment will be scheduled</li>
                </ul>
              ` : `
                <ul>
                  <li>🏥 Hospital staff will review your request</li>
                  <li>📞 You'll receive a call within 2-4 hours</li>
                  <li>🩸 Blood availability will be confirmed</li>
                  <li>📅 Collection details will be arranged</li>
                </ul>
              `}
            </div>
            
            <p><strong>Track your request:</strong> <a href="http://localhost:3000/track-request" style="color: #667eea;">Click here to track</a></p>
            
            <div class="footer">
              <p>Thank you for using our blood bank service!</p>
              <p>🩸 Saving lives together 🩸</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Prepare SMS content
    const smsMessage = `🩸 Blood ${type} confirmed! 
Reference: ${referenceNumber}
Hospital: ${hospital}
Status: Pending
Track: http://localhost:3000/track-request
Thank you!`;

    // Send notifications
    console.log("📧 Sending email notification...");
    const emailResult = await sendEmailNotification(email, emailSubject, emailContent);
    
    console.log("📱 Sending SMS notification...");
    const smsResult = await sendSMSNotification(phoneNumber, smsMessage);

    console.log("✅ Request created successfully:", referenceNumber);

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

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Blood Bank Notification Server is running!", 
    features: ["Email notifications", "SMS notifications", "Request tracking"],
    requests: requestsDatabase.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Blood Bank Notification Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: ENABLED (Gmail)`);
  console.log(`📱 SMS notifications: ENABLED (Simulated)`);
  console.log(`🩸 Ready to send notifications for blood requests!`);
});
