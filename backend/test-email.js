const nodemailer = require("nodemailer");

console.log("🧪 Testing email configuration...");

// Test email configuration
const testEmail = async () => {
  try {
    console.log("📧 Creating email transporter...");
    
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: "tanveerojasara@gmail.com",
        pass: "zvadydzjuqbjpuco", // Your app password
      },
    });

    console.log("✅ Transporter created successfully");
    console.log("🔍 Verifying SMTP connection...");

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");

    console.log("📤 Sending test email...");

    // Send test email
    const testMailOptions = {
      from: "tanveerojasara@gmail.com",
      to: "tanveerojasara@gmail.com", // Send to yourself first
      subject: "🧪 Blood Bank Test Email - " + new Date().toLocaleString(),
      html: `
        <h2>🩸 Blood Bank Email Test</h2>
        <p>This is a test email to verify email notifications are working.</p>
        <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
          <h3>📋 Test Reference Number</h3>
          <div style="font-size: 24px; font-weight: bold; color: black; font-family: monospace;">
            REF-TEST-${Date.now().toString().slice(-6)}
          </div>
        </div>
        <p>If you received this email, the notification system is working correctly!</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    const result = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", result.messageId);
    console.log("📬 Email sent to: tanveerojasara@gmail.com");
    console.log("🎯 Check your inbox (and spam folder) for the test email");

  } catch (error) {
    console.error("❌ Email test failed:");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    if (error.code === 'EAUTH') {
      console.log("\n🔧 AUTHENTICATION ERROR - Possible solutions:");
      console.log("1. Check if the email address is correct");
      console.log("2. Verify the app password is correct");
      console.log("3. Make sure 2-factor authentication is enabled on Gmail");
      console.log("4. Generate a new app password from Google Account settings");
    } else if (error.code === 'ENOTFOUND') {
      console.log("\n🌐 NETWORK ERROR - Possible solutions:");
      console.log("1. Check your internet connection");
      console.log("2. Check if Gmail SMTP is accessible");
      console.log("3. Try again in a few minutes");
    }
  }
};

// Run the test
testEmail();
