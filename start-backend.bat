@echo off
echo 🚀 Starting Blood Bank Backend Server...
echo.
echo 📍 Server will run on: http://localhost:5000
echo 📧 Email notifications: Enabled
echo 📱 SMS notifications: Simulated (console output)
echo.
echo ⚠️  Make sure you have installed dependencies:
echo    cd backend
echo    npm install
echo.
echo 🔄 Starting server...
cd backend
node server.cjs
pause
