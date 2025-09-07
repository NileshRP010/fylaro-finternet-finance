@echo off
echo.
echo ============================================
echo   Fylaro Finance Frontend Deployment
echo ============================================
echo.

echo Installing dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo Building for production...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Build completed successfully!
echo ============================================
echo.
echo Your frontend is ready for deployment!
echo.
echo Next steps:
echo 1. Upload the 'dist' folder to your hosting provider
echo 2. Or deploy directly to Vercel using 'vercel' command
echo 3. Configure environment variables on your platform
echo.

echo Starting preview server...
call npm run preview

pause
