# 🩸 Blood Bank Troubleshooting Guide

## ❌ "Error submitting donation request" Issue

### 🔍 Common Causes & Solutions:

#### 1. **Backend Server Not Running**
**Problem:** The backend server on port 5000 is not started.

**Solution:**
```bash
# Method 1: Use the batch file
double-click start-backend.bat

# Method 2: Manual start
cd backend
node server.cjs
```

**Expected Output:**
```
Server running on http://localhost:5000
```

#### 2. **Missing Dependencies**
**Problem:** Backend dependencies not installed.

**Solution:**
```bash
cd backend
npm install
```

#### 3. **Port 5000 Already in Use**
**Problem:** Another application is using port 5000.

**Solution:**
- Close other applications using port 5000
- Or change the port in `backend/server.cjs`:
```javascript
const PORT = 5001; // Change to different port
```

#### 4. **CORS Issues**
**Problem:** Cross-origin requests blocked.

**Solution:** Already configured in backend with:
```javascript
app.use(cors());
```

#### 5. **Form Validation Errors**
**Problem:** Required fields missing or invalid.

**Check:**
- All required fields are filled
- Email format is valid
- Phone number is provided
- Blood type is selected

### 🧪 Testing Steps:

#### Step 1: Check Backend
1. Open terminal/command prompt
2. Navigate to backend folder: `cd backend`
3. Start server: `node server.cjs`
4. Look for: "Server running on http://localhost:5000"

#### Step 2: Test API Directly
Open browser and go to: `http://localhost:5000`
- Should see: "Cannot GET /" (this is normal)

#### Step 3: Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Submit form and check for errors

#### Step 4: Check Network Tab
1. Open Developer Tools → Network tab
2. Submit form
3. Look for `/create-request` request
4. Check if it's successful (status 201) or failed

### 📋 Debug Information:

#### Backend Logs to Look For:
```
📥 Received create-request: { name: "...", email: "...", ... }
📋 Processing request: { name: "...", email: "...", ... }
✅ Request created successfully: REF-123456
```

#### Frontend Error Messages:
- **Network Error:** Backend server not running
- **Validation Error:** Missing required fields
- **Server Error:** Backend processing failed

### 🔧 Quick Fixes:

#### Fix 1: Restart Backend
```bash
# Stop server (Ctrl+C)
# Then restart
cd backend
node server.cjs
```

#### Fix 2: Clear Browser Cache
- Press Ctrl+F5 to hard refresh
- Or clear browser cache

#### Fix 3: Check Form Data
Make sure all these fields are filled:
- Name
- Contact Number
- Email
- Blood Type
- Address
- Preferred Date
- Preferred Time

### 📞 Still Having Issues?

#### Check These Files:
1. `backend/server.cjs` - Backend server
2. `src/component/DonateForm.jsx` - Frontend form
3. Browser console for JavaScript errors
4. Network tab for API call failures

#### Common Error Messages:
- **"Failed to fetch"** → Backend not running
- **"Missing required fields"** → Form validation failed
- **"Network Error"** → Connection issue

### ✅ Success Indicators:
- Backend shows: "✅ Request created successfully: REF-XXXXXX"
- Frontend redirects to thank you page
- Reference number is displayed
- Email notification sent (check console)

### 🚀 Production Checklist:
- [ ] Backend server running
- [ ] All dependencies installed
- [ ] Port 5000 available
- [ ] Email configuration correct
- [ ] Form validation working
- [ ] Database connection (if using real DB)
