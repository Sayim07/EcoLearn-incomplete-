@echo off
echo ========================================
echo    🌱 EcoLearn Application Launcher
echo ========================================
echo.

echo Starting Backend Server...
start "EcoLearn Backend" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Testing backend connection...
curl -s http://localhost:5000/api/health > nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running successfully!
) else (
    echo ❌ Backend connection failed. Please check the backend window.
)

echo.
echo Starting Frontend Application...
start "EcoLearn Frontend" cmd /k "cd frontend && npx react-scripts start"

echo Waiting for frontend to start...
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo    🎉 EcoLearn is Starting Up!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo Demo Version: frontend-simple/index.html
echo API Test: api-test.html
echo.
echo Opening applications in your browser...
echo.

start http://localhost:3000
start http://localhost:5000/api/health
start frontend-simple/index.html
start api-test.html

echo.
echo ✅ All applications are launching!
echo 🌱 EcoLearn Environmental Education Platform is ready!
echo.
echo If you see "Connection Failed" errors:
echo 1. Wait a few more seconds for the backend to fully start
echo 2. Refresh the frontend page
echo 3. Check the API test page for detailed status
echo.
pause
