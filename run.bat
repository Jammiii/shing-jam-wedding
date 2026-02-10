@echo off
echo Shing & Jam Wedding Website
echo =================================
echo.
echo Step 1: Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Installation failed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit
)

echo.
echo Step 2: Starting local server...
echo.
echo Your website will open at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo Starting server...
npm run dev
