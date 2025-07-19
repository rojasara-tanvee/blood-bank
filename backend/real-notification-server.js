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

// Create email transporter with better configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'tanveerojasara@gmail.com',
      pass: 'zvadydzjuqbjpuco'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Function to send real email
const sendRealEmail = async (toEmail, subject, htmlContent) => {
  try {
    console.log(`📧 Attempting to send email to: ${toEmail}`);
    
    const transporter = createEmailTransporter();
    
    // Verify connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    const mailOptions = {
      from: '"Blood Bank Service" <tanveerojasara@gmail.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, '') // Plain text fallback
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ EMAIL SENT SUCCESSFULLY!`);
    console.log(`📧 To: ${toEmail}`);
    console.log(`📧 Message ID: ${result.messageId}`);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error(`❌ EMAIL FAILED:`, error.message);
    return { success: false, error: error.message };
  }
};

// Function to send real SMS using TextBelt (free service)
const sendRealSMS = async (phoneNumber, message) => {
  try {
    console.log(`📱 Attempting to send SMS to: ${phoneNumber}`);
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming India +91)
    const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
    
    console.log(`📱 Formatted phone: ${formattedPhone}`);
    
    // Using TextBelt free SMS service
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message,
        key: 'textbelt' // Free quota: 1 SMS per day per IP
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ SMS SENT SUCCESSFULLY!`);
      console.log(`📱 To: ${formattedPhone}`);
      console.log(`📱 Text ID: ${result.textId}`);
      return { success: true, textId: result.textId };
    } else {
      console.log(`⚠️ SMS FAILED: ${result.error}`);
      // Fallback: Log SMS content for manual sending
      console.log(`📱 SMS CONTENT TO SEND MANUALLY:`);
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      return { success: false, error: result.error, fallback: true };
    }
    
  } catch (error) {
    console.error(`❌ SMS ERROR:`, error.message);
    // Fallback: Log SMS content
    console.log(`📱 SMS CONTENT TO SEND MANUALLY:`);
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    return { success: false, error: error.message, fallback: true };
  }
};

// Create new request with REAL notifications
app.post("/create-request", async (req, res) => {
  console.log("\n🩸 NEW REQUEST RECEIVED");
  console.log("═══════════════════════════════════");
  
  try {
    const { name, email, phone, contact, hospital, bloodGroup, type, address, additionalInfo } = req.body;
    
    const phoneNumber = phone || contact;
    
    if (!name || !email || !phoneNumber || !hospital || !bloodGroup || !type) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }
    
    const referenceNumber = `REF-${requestCounter++}`;
    console.log(`🎫 Generated Reference: ${referenceNumber}`);
    
    // Store request
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
      timeline: [{
        status: 'pending',
        date: new Date(),
        message: 'Request submitted successfully'
      }]
    };

    requestsDatabase.push(newRequest);

    // Prepare email content
    const emailSubject = `🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: white; }
        .ref-box { background: #f0f8ff; border: 3px solid #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
        .ref-number { font-size: 28px; font-weight: bold; color: #000; font-family: 'Courier New', monospace; letter-spacing: 2px; }
        .details { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #667eea; }
        .footer { background: #667eea; color: white; padding: 20px; text-align: center; }
        .highlight { color: #667eea; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩸 Blood Bank Confirmation</h1>
            <h2>${type === 'donation' ? 'Donation Request' : 'Blood Request'} Received</h2>
        </div>
        
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been <span class="highlight">successfully submitted</span>!</p>
            
            <div class="ref-box">
                <h3>📋 Your Reference Number</h3>
                <div class="ref-number">${referenceNumber}</div>
                <p><strong>⚠️ IMPORTANT: Save this number for tracking!</strong></p>
            </div>
            
            <div class="details">
                <h3>📋 Request Details</h3>
                <p><strong>🏥 Hospital:</strong> ${hospital}</p>
                <p><strong>🩸 Blood Group:</strong> ${bloodGroup}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📱 Phone:</strong> ${phoneNumber}</p>
                <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>📊 Status:</strong> <span style="color: #f39c12;">Pending Review</span></p>
            </div>
            
            <div class="details">
                <h3>📞 What Happens Next?</h3>
                ${type === 'donation' ? `
                    <ul>
                        <li>🏥 Hospital staff will review your donation offer</li>
                        <li>📞 You'll receive a call within <strong>2-4 hours</strong></li>
                        <li>🩸 Donation eligibility will be confirmed</li>
                        <li>📅 Donation appointment will be scheduled</li>
                        <li>🎯 Pre-donation health check will be arranged</li>
                    </ul>
                ` : `
                    <ul>
                        <li>🏥 Hospital staff will review your blood request</li>
                        <li>📞 You'll receive a call within <strong>2-4 hours</strong></li>
                        <li>🩸 Blood availability will be confirmed</li>
                        <li>📅 Collection/delivery details will be arranged</li>
                        <li>🚑 Emergency procedures if urgent</li>
                    </ul>
                `}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p><strong>🔍 Track your request anytime:</strong></p>
                <a href="http://localhost:3000/track-request" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Request</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for using our Blood Bank Service!</strong></p>
            <p>🩸 Saving Lives Together 🩸</p>
            <p>For urgent matters, contact the hospital directly.</p>
        </div>
    </div>
</body>
</html>`;

    // Prepare SMS content
    const smsMessage = `🩸 Blood ${type} confirmed! 
Ref: ${referenceNumber}
Hospital: ${hospital}
Blood Group: ${bloodGroup}
Status: Pending
Hospital will call you within 2-4 hours.
Track: http://localhost:3000/track-request
Thank you!`;

    console.log("\n📤 SENDING NOTIFICATIONS...");
    
    // Send email
    const emailResult = await sendRealEmail(email, emailSubject, emailHTML);
    
    // Send SMS
    const smsResult = await sendRealSMS(phoneNumber, smsMessage);

    console.log("\n📊 NOTIFICATION RESULTS:");
    console.log(`📧 Email: ${emailResult.success ? 'SENT ✅' : 'FAILED ❌'}`);
    console.log(`📱 SMS: ${smsResult.success ? 'SENT ✅' : 'FAILED ❌'}`);

    res.status(201).json({
      success: true,
      referenceNumber,
      message: 'Request created and notifications sent',
      notifications: {
        email: emailResult,
        sms: smsResult
      }
    });

  } catch (error) {
    console.error("\n❌ REQUEST ERROR:", error);
    res.status(500).json({ 
      error: "Failed to create request",
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
        error: "Request not found" 
      });
    }

    res.status(200).json(request);

  } catch (error) {
    res.status(500).json({ error: "Failed to track request" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Blood Bank REAL Notification Server", 
    features: ["Real Email", "Real SMS", "Request Tracking"],
    requests: requestsDatabase.length,
    status: "🚀 READY TO SEND REAL NOTIFICATIONS"
  });
});

app.listen(PORT, () => {
  console.log("\n🚀 BLOOD BANK REAL NOTIFICATION SERVER");
  console.log("═══════════════════════════════════════════");
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📧 Email: REAL (Gmail SMTP)`);
  console.log(`📱 SMS: REAL (TextBelt API)`);
  console.log(`🩸 Status: READY FOR REAL NOTIFICATIONS`);
  console.log("═══════════════════════════════════════════");
  console.log("\n💡 This server sends ACTUAL emails and SMS!");
  console.log("📧 Users will receive real email confirmations");
  console.log("📱 Users will receive real SMS notifications");
  console.log("\n⏳ Waiting for requests...\n");
});
