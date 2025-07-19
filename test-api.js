// Test script for the Blood Bank API
const testData = {
  name: "Test User",
  email: "test@example.com",
  contact: "1234567890",
  hospital: "Test Hospital",
  bloodGroup: "A+",
  type: "donation",
  address: "Test Address"
};

async function testAPI() {
  try {
    console.log("🧪 Testing Blood Bank API...");
    console.log("📤 Sending request:", testData);
    
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
      console.log("✅ API Test PASSED!");
      console.log("🎫 Reference Number:", data.referenceNumber);
    } else {
      console.log("❌ API Test FAILED!");
      console.log("🚨 Error:", data.error);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
    console.log("🔍 Make sure backend server is running on port 5000");
  }
}

// Run the test
testAPI();
