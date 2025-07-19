const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());

// Simple test endpoint
app.post("/create-request", (req, res) => {
  console.log("📥 Received request:", req.body);
  
  const referenceNumber = `REF-${Date.now()}`;
  
  res.status(201).json({
    success: true,
    referenceNumber,
    message: 'Request created successfully'
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
});
