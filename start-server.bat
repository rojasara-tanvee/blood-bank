@echo off
echo ========================================
echo    BLOOD BANK SERVER STARTUP
echo ========================================
echo.
echo Starting server on port 5000...
echo.
cd backend
echo Current directory: %CD%
echo.
echo Starting minimal server...
node minimal-server.js
echo.
echo If you see this message, the server stopped unexpectedly.
pause
