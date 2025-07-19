const express = require("express");
const cors = require("cors");

console.log("🚀 Starting minimal server...");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let requestCounter = 100000;

app.post("/create-request", (req, res) => {
  console.log("📥 Request received:", req.body);
  
  const referenceNumber = `REF-${requestCounter++}`;
  
  console.log("✅ Sending response:", referenceNumber);
  
  res.status(201).json({
    success: true,
    referenceNumber,
    message: 'Request created successfully'
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

console.log("📋 Server setup complete");
