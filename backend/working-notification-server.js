import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// In-memory storage
let requestsDatabase = [];
let requestCounter = 100000;

// Email configuration with better error handling
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'tanveerojasara@gmail.com',
      pass: 'zvadydzjuqbjpuco'
    }
  });
};

// Send email with detailed logging
const sendEmail = async (toEmail, subject, htmlContent) => {
  console.log(`\n📧 ATTEMPTING EMAIL SEND:`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  
  try {
    const transporter = createEmailTransporter();
    
    // Test connection first
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    const mailOptions = {
      from: '"Blood Bank Service" <tanveerojasara@gmail.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent
    };

    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log(`Message ID: ${result.messageId}`);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ EMAIL FAILED:');
    console.error(`Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    return { success: false, error: error.message };
  }
};

// Send SMS with detailed logging
const sendSMS = async (phoneNumber, message) => {
  console.log(`\n📱 ATTEMPTING SMS SEND:`);
  console.log(`To: ${phoneNumber}`);
  console.log(`Message: ${message}`);
  
  try {
    // Clean and format phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
    
    console.log(`📱 Formatted phone: ${formattedPhone}`);
    console.log('📤 Sending SMS via TextBelt...');
    
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message,
        key: 'textbelt'
      })
    });

    const result = await response.json();
    console.log('📱 SMS API Response:', result);

    if (result.success) {
      console.log('✅ SMS SENT SUCCESSFULLY!');
      console.log(`Text ID: ${result.textId}`);
      return { success: true, textId: result.textId };
    } else {
      console.log('❌ SMS FAILED:');
      console.log(`Error: ${result.error}`);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ SMS ERROR:');
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Create request endpoint
app.post('/create-request', async (req, res) => {
  console.log('\n🩸 NEW REQUEST RECEIVED');
  console.log('═══════════════════════════════════');
  console.log('Request data:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, phone, contact, hospital, bloodGroup, type, address, additionalInfo } = req.body;
    
    const phoneNumber = phone || contact;
    
    if (!name || !email || !phoneNumber || !hospital || !bloodGroup || !type) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }
    
    const referenceNumber = `REF-${requestCounter++}`;
    console.log(`🎫 Generated reference: ${referenceNumber}`);
    
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
      updatedAt: new Date()
    };

    requestsDatabase.push(newRequest);
    console.log(`✅ Request stored. Total requests: ${requestsDatabase.length}`);

    // Prepare email content
    const emailSubject = `🩸 Blood ${type === 'donation' ? 'Donation' : 'Request'} Confirmation - ${referenceNumber}`;
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: white; }
        .ref-box { background: #f0f8ff; border: 3px solid #000; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
        .ref-number { font-size: 28px; font-weight: bold; color: #000; font-family: 'Courier New', monospace; }
        .details { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩸 Blood Bank Confirmation</h1>
            <h2>${type === 'donation' ? 'Donation Request' : 'Blood Request'}</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your ${type === 'donation' ? 'blood donation offer' : 'blood request'} has been submitted successfully!</p>
            
            <div class="ref-box">
                <h3>📋 Your Reference Number</h3>
                <div class="ref-number">${referenceNumber}</div>
                <p><strong>Save this number for tracking!</strong></p>
            </div>
            
            <div class="details">
                <h3>📋 Request Details</h3>
                <p><strong>Hospital:</strong> ${hospital}</p>
                <p><strong>Blood Group:</strong> ${bloodGroup}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phoneNumber}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p><strong>Hospital will contact you within 2-4 hours.</strong></p>
            <p>Track your request: <a href="http://localhost:3000/track-request">Click here</a></p>
        </div>
    </div>
</body>
</html>`;

    // Prepare SMS content
    const smsMessage = `🩸 Blood ${type} confirmed!
Ref: ${referenceNumber}
Hospital: ${hospital}
Blood Group: ${bloodGroup}
Hospital will call you within 2-4 hours.
Track: http://localhost:3000/track-request`;

    console.log('\n📤 SENDING NOTIFICATIONS...');
    
    // Send notifications
    const emailResult = await sendEmail(email, emailSubject, emailHTML);
    const smsResult = await sendSMS(phoneNumber, smsMessage);

    console.log('\n📊 NOTIFICATION RESULTS:');
    console.log(`📧 Email: ${emailResult.success ? 'SUCCESS ✅' : 'FAILED ❌'}`);
    console.log(`📱 SMS: ${smsResult.success ? 'SUCCESS ✅' : 'FAILED ❌'}`);

    if (emailResult.success) {
      console.log(`📧 Email sent to: ${email}`);
    } else {
      console.log(`📧 Email failed: ${emailResult.error}`);
    }

    if (smsResult.success) {
      console.log(`📱 SMS sent to: ${phoneNumber}`);
    } else {
      console.log(`📱 SMS failed: ${smsResult.error}`);
    }

    res.status(201).json({
      success: true,
      referenceNumber,
      message: 'Request created',
      notifications: {
        email: emailResult,
        sms: smsResult
      }
    });

  } catch (error) {
    console.error('\n❌ REQUEST ERROR:', error);
    res.status(500).json({ 
      error: 'Failed to create request',
      details: error.message 
    });
  }
});

// Track request
app.post('/track-request', async (req, res) => {
  try {
    const { referenceNumber, contactNumber, email } = req.body;

    const request = requestsDatabase.find(req => 
      req.referenceNumber === referenceNumber && 
      (req.phone === contactNumber || req.email === email)
    );

    if (!request) {
      return res.status(404).json({ 
        error: 'Request not found' 
      });
    }

    res.status(200).json(request);

  } catch (error) {
    res.status(500).json({ error: 'Failed to track request' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blood Bank Working Notification Server',
    status: 'RUNNING',
    requests: requestsDatabase.length
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 BLOOD BANK WORKING NOTIFICATION SERVER');
  console.log('═══════════════════════════════════════════');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📧 Email: Gmail SMTP`);
  console.log(`📱 SMS: TextBelt API`);
  console.log(`🩸 Status: READY`);
  console.log('═══════════════════════════════════════════');
  console.log('\n💡 Server is ready to send notifications!');
  console.log('📧 Email and SMS delivery will be logged here');
  console.log('\n⏳ Waiting for requests...\n');
});
