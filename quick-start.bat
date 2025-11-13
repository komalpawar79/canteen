@echo off
REM Campus Canteen - Quick Start Script for Windows

echo.
echo 🍜 Campus Canteen - Quick Start Guide
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Backend setup
echo 📦 Setting up Backend...
echo ================================

cd backend

if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

if not exist ".env" (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration!
) else (
    echo ✅ .env file already exists
)

echo.
echo ✅ Backend setup complete!
echo.

REM Frontend setup
echo 📦 Setting up Frontend...
echo ================================

cd ..\frontend

if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..

echo.
echo ✅ Frontend setup complete!
echo.

REM Summary
echo 🎉 Setup Complete!
echo ================================
echo.
echo 📝 Next steps:
echo.
echo 1. Start MongoDB (if using local):
echo    Run mongod in Command Prompt
echo.
echo 2. Start Backend Server:
echo    cd backend
echo    npm run dev
echo    Server will run on: http://localhost:5000
echo.
echo 3. Start Frontend Server (in new terminal):
echo    cd frontend
echo    npm start
echo    App will open on: http://localhost:3000
echo.
echo 4. Login with demo credentials:
echo    Email: demo@university.edu
echo    Password: password123
echo.
echo 📚 Documentation:
echo    - README.md - Project overview
echo    - SETUP.md - Detailed setup guide
echo    - API_DOCUMENTATION.md - API endpoints
echo    - DEVELOPMENT.md - Development guidelines
echo.
echo 🔗 Useful Links:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:5000/api/health
echo    - MongoDB: mongodb://localhost:27017/campus-canteen
echo.
echo Happy coding! 🚀
echo.
pause
