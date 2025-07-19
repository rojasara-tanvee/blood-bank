// Test the notification server directly
console.log("🧪 Testing notification server...");

const testData = {
  name: "Test User",
  email: "tanveerojasara2004@gmail.com", // Your email
  contact: "9023104036", // Your phone
  hospital: "Test Hospital",
  bloodGroup: "A+",
  type: "donation",
  address: "Test Address"
};

async function testNotificationServer() {
  try {
    console.log("📤 Sending test request to server...");
    
    const response = await fetch('http://localhost:5000/create-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log("📥 Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("📋 Response data:", JSON.stringify(data, null, 2));
      
      console.log("\n✅ SERVER TEST RESULTS:");
      console.log(`🎫 Reference Number: ${data.referenceNumber}`);
      console.log(`📧 Email Status: ${data.notifications.email.success ? 'SENT ✅' : 'FAILED ❌'}`);
      console.log(`📱 SMS Status: ${data.notifications.sms.success ? 'SENT ✅' : 'FAILED ❌'}`);
      
      if (data.notifications.email.success) {
        console.log("📧 Check your email: tanveerojasara2004@gmail.com");
      } else {
        console.log(`📧 Email error: ${data.notifications.email.error}`);
      }
      
      if (data.notifications.sms.success) {
        console.log("📱 Check your phone: 9023104036");
      } else {
        console.log(`📱 SMS error: ${data.notifications.sms.error}`);
      }
      
    } else {
      const errorData = await response.text();
      console.log("❌ Server error:", errorData);
    }

  } catch (error) {
    console.log("❌ Connection error:", error.message);
    console.log("\n🔍 Troubleshooting:");
    console.log("1. Make sure the server is running: node backend/working-notification-server.js");
    console.log("2. Check if port 5000 is available");
    console.log("3. Verify server started without errors");
  }
}

// Test server health first
async function testServerHealth() {
  try {
    console.log("🔍 Checking server health...");
    const response = await fetch('http://localhost:5000/');
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Server is running:", data.message);
      console.log(`📊 Total requests: ${data.requests}`);
      return true;
    } else {
      console.log("❌ Server health check failed");
      return false;
    }
  } catch (error) {
    console.log("❌ Server not reachable:", error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting server tests...\n");
  
  const serverHealthy = await testServerHealth();
  
  if (serverHealthy) {
    console.log("\n📤 Testing notification functionality...");
    await testNotificationServer();
  } else {
    console.log("\n❌ Server is not running or not reachable");
    console.log("🔧 Start the server first:");
    console.log("   node backend/working-notification-server.js");
  }
}

runTests();
