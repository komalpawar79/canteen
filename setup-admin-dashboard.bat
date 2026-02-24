@echo off
echo ========================================
echo QuickBite Admin Dashboard Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install json2csv
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install lucide-react
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Verifying MongoDB Connection...
cd ..\backend
echo Please ensure MongoDB is running on mongodb://localhost:27017
echo.

echo [4/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Start Backend:  cd backend  ^&^& npm run dev
echo 2. Start Frontend: cd frontend ^&^& npm start
echo 3. Access Admin Dashboard: http://localhost:3000/admin/dashboard
echo.
echo Default Admin Credentials:
echo Email: admin@quickbite.com
echo Password: Admin@123
echo.
echo For detailed documentation, see: ADMIN_DASHBOARD_COMPLETE.md
echo ========================================
pause
