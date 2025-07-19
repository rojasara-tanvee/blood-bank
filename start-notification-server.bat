@echo off
echo ========================================
echo   BLOOD BANK NOTIFICATION SERVER
echo ========================================
echo.
echo 🚀 Starting notification server...
echo 📧 Email notifications: ENABLED
echo 📱 SMS notifications: ENABLED
echo 🩸 Reference number generation: ENABLED
echo.
echo Server will run on: http://localhost:5000
echo.
cd backend
echo Starting notification server...
node notification-server.js
echo.
echo Server stopped. Press any key to exit.
pause
