@echo off
REM QuickBite - Complete Startup Script
REM This script starts MongoDB, Backend, and Frontend

echo.
echo ╔═══════════════════════════════════════╗
echo ║     QuickBite - Complete Startup      ║
echo ║  Starting MongoDB, Backend, Frontend  ║
echo ╚═══════════════════════════════════════╝
echo.

REM Get the directory
cd /d C:\Users\Komal\Downloads\canteen

REM Start MongoDB in a new window
echo [1/3] Starting MongoDB on port 27017...
start "MongoDB" mongod

REM Wait a bit for MongoDB to start
timeout /t 3 /nobreak

REM Start Backend in a new window
echo [2/3] Starting Backend on port 5000...
start "Backend - QuickBite" cmd /k "cd backend && npm run dev"

REM Wait a bit for Backend to start
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo [3/3] Starting Frontend on port 3000...
start "Frontend - QuickBite" cmd /k "cd frontend && npm start"

REM Wait a bit
timeout /t 2 /nobreak

echo.
echo ╔═══════════════════════════════════════╗
echo ║        All Services Starting          ║
echo ╚═══════════════════════════════════════╝
echo.
echo ✓ MongoDB:  http://localhost:27017
echo ✓ Backend:  http://localhost:5000/api/health
echo ✓ Frontend: http://localhost:3000
echo.
echo Open browser and go to: http://localhost:3000
echo.
echo Press any key to close this window...
pause
