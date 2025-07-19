// Test the notification system
const testData = {
  name: "Test User",
  email: "test@example.com",
  contact: "1234567890",
  hospital: "Test Hospital",
  bloodGroup: "A+",
  type: "donation",
  address: "Test Address"
};

async function testNotifications() {
  try {
    console.log("🧪 Testing notification system...");
    console.log("📤 Sending test request...");
    
    const response = await fetch('http://localhost:5000/create-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log("📥 Response status:", response.status);
    
    const data = await response.json();
    console.log("📋 Response data:", data);

    if (response.ok) {
      console.log("\n✅ NOTIFICATION TEST SUCCESSFUL!");
      console.log("🎫 Reference Number:", data.referenceNumber);
      console.log("📧 Email Status:", data.notifications.email.success ? 'SENT' : 'FAILED');
      console.log("📱 SMS Status:", data.notifications.sms.success ? 'SENT' : 'FAILED');
      console.log("\n💡 Check the server console for detailed notification output!");
    } else {
      console.log("\n❌ NOTIFICATION TEST FAILED!");
      console.log("🚨 Error:", data.error);
    }

  } catch (error) {
    console.log("\n❌ NETWORK ERROR:", error.message);
    console.log("🔍 Make sure the server is running on port 5000");
  }
}

// Run the test
testNotifications();
