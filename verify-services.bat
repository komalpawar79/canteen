@echo off
REM QuickBite - Verification Script
REM Checks if all services are running correctly

echo.
echo ╔════════════════════════════════════════╗
echo ║   QuickBite - Services Verification    ║
echo ╚════════════════════════════════════════╝
echo.

REM Check MongoDB
echo [Checking] MongoDB on port 27017...
netstat -ano | find ":27017" >nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB is RUNNING
) else (
    echo ✗ MongoDB is NOT running - Start with: mongod
)
echo.

REM Check Backend
echo [Checking] Backend on port 5000...
netstat -ano | find ":5000" >nul
if %errorlevel% equ 0 (
    echo ✓ Backend is RUNNING
) else (
    echo ✗ Backend is NOT running - Start with: cd backend ^&^& npm run dev
)
echo.

REM Check Frontend
echo [Checking] Frontend on port 3000...
netstat -ano | find ":3000" >nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is RUNNING
) else (
    echo ✗ Frontend is NOT running - Start with: cd frontend ^&^& npm start
)
echo.

echo ╔════════════════════════════════════════╗
echo ║          Verification Complete         ║
echo ╚════════════════════════════════════════╝
echo.
echo Quick Links:
echo • MongoDB:  http://localhost:27017
echo • Backend:  http://localhost:5000/api/health
echo • Frontend: http://localhost:3000
echo.
pause
