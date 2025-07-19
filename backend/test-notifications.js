const nodemailer = require("nodemailer");

console.log("🧪 TESTING EMAIL AND SMS SERVICES");
console.log("═══════════════════════════════════");

// Test email configuration
const testEmail = async () => {
  console.log("\n📧 TESTING EMAIL SERVICE...");
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'tanveerojasara@gmail.com',
        pass: 'zvadydzjuqbjpuco'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ Email transporter created");

    // Verify connection
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!");

    // Send test email
    console.log("📤 Sending test email...");
    const result = await transporter.sendMail({
      from: '"Blood Bank Test" <tanveerojasara@gmail.com>',
      to: 'tanveerojasara2004@gmail.com',
      subject: '🧪 Blood Bank Email Test - ' + new Date().toLocaleString(),
      html: `
        <h2>🩸 Email Test Successful!</h2>
        <p>This email confirms that the notification system is working.</p>
        <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
          <h3>📋 Test Reference Number</h3>
          <div style="font-size: 24px; font-weight: bold; color: black; font-family: monospace;">
            REF-TEST-${Date.now().toString().slice(-6)}
          </div>
        </div>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log("✅ EMAIL TEST SUCCESSFUL!");
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log("📬 Check your inbox: tanveerojasara2004@gmail.com");
    return true;

  } catch (error) {
    console.error("❌ EMAIL TEST FAILED:");
    console.error(`Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    if (error.code === 'EAUTH') {
      console.log("\n🔧 EMAIL AUTHENTICATION ISSUE:");
      console.log("1. Check if Gmail 2FA is enabled");
      console.log("2. Generate new App Password");
      console.log("3. Update password in server file");
    }
    return false;
  }
};

// Test SMS service
const testSMS = async () => {
  console.log("\n📱 TESTING SMS SERVICE...");
  
  try {
    const testPhone = "+919023104036"; // Your phone number
    const testMessage = `🧪 Blood Bank SMS Test
Ref: REF-TEST-${Date.now().toString().slice(-6)}
Time: ${new Date().toLocaleString()}
This is a test SMS from your blood bank notification system.`;

    console.log(`📱 Sending SMS to: ${testPhone}`);
    
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: testPhone,
        message: testMessage,
        key: 'textbelt'
      })
    });

    const result = await response.json();
    console.log("📱 SMS API Response:", result);

    if (result.success) {
      console.log("✅ SMS TEST SUCCESSFUL!");
      console.log(`📱 Text ID: ${result.textId}`);
      console.log("📲 Check your phone for the test SMS");
      return true;
    } else {
      console.log("❌ SMS TEST FAILED:");
      console.log(`Error: ${result.error}`);
      
      if (result.error && result.error.includes('quota')) {
        console.log("\n🔧 SMS QUOTA ISSUE:");
        console.log("1. TextBelt free quota: 1 SMS per day per IP");
        console.log("2. You may have used today's quota");
        console.log("3. Try again tomorrow or upgrade to paid");
      }
      return false;
    }

  } catch (error) {
    console.error("❌ SMS TEST FAILED:");
    console.error(`Error: ${error.message}`);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log("🚀 Starting notification tests...\n");
  
  const emailWorking = await testEmail();
  const smsWorking = await testSMS();
  
  console.log("\n📊 TEST RESULTS:");
  console.log("═══════════════════════════════════");
  console.log(`📧 Email Service: ${emailWorking ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`📱 SMS Service: ${smsWorking ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (emailWorking && smsWorking) {
    console.log("\n🎉 ALL SERVICES WORKING!");
    console.log("Your notification system is ready to send real emails and SMS.");
  } else if (emailWorking) {
    console.log("\n⚠️ EMAIL ONLY WORKING");
    console.log("Users will receive emails but not SMS notifications.");
  } else if (smsWorking) {
    console.log("\n⚠️ SMS ONLY WORKING");
    console.log("Users will receive SMS but not email notifications.");
  } else {
    console.log("\n❌ BOTH SERVICES FAILED");
    console.log("Check the error messages above for troubleshooting steps.");
  }
  
  console.log("\n💡 Next Steps:");
  if (!emailWorking) {
    console.log("📧 Fix email: Check Gmail app password and 2FA settings");
  }
  if (!smsWorking) {
    console.log("📱 Fix SMS: Check TextBelt quota or try different service");
  }
  if (emailWorking || smsWorking) {
    console.log("🚀 Start notification server: node backend/real-notification-server.js");
  }
};

// Run the tests
runTests().catch(console.error);
