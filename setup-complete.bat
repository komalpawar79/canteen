@echo off
echo ========================================
echo QuickBite - Complete Setup
echo ========================================
echo.

cd backend

echo [1/3] Creating 4 Canteens...
node scripts/seedCanteens.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to create canteens
    pause
    exit /b 1
)
echo.

echo [2/3] Creating Categories...
node scripts/seedCategories.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to create categories
    pause
    exit /b 1
)
echo.

echo [3/3] Fixing Old Menu Items...
node scripts/fixMenuItems.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to fix menu items
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Created:
echo - 4 Canteens (Main Canteen, Food Court, Quick Bites, Cafe Coffee)
echo - 6 Categories (Breakfast, Lunch, Snacks, Beverages, Desserts, Special)
echo - Fixed old menu items
echo.
echo Next Steps:
echo 1. Restart backend: npm run dev
echo 2. Refresh admin dashboard
echo 3. Add menu items for each canteen
echo.
pause
