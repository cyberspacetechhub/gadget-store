@echo off
echo ========================================
echo   Gadget E-commerce Platform Setup
echo ========================================
echo.

echo [1/6] Setting up Backend...
cd BackEnd
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please update the .env file with your configuration!
    echo.
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies!
    pause
    exit /b 1
)
echo Backend setup complete!
echo.

echo [2/6] Setting up Frontend...
cd ..\Front_End
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo Frontend setup complete!
echo.

echo [3/6] Creating necessary directories...
cd ..\BackEnd
if not exist logs mkdir logs
if not exist public\uploads mkdir public\uploads
echo Directories created!
echo.

echo [4/6] Setting up TailwindCSS...
cd ..\Front_End
call npx tailwindcss init -p
echo TailwindCSS configured!
echo.

echo [5/6] Checking Node.js version...
node --version
npm --version
echo.

echo [6/6] Setup Summary
echo ========================================
echo ✅ Backend dependencies installed
echo ✅ Frontend dependencies installed  
echo ✅ Environment files created
echo ✅ Directories created
echo ✅ TailwindCSS configured
echo.
echo Next Steps:
echo 1. Update BackEnd\.env with your configuration
echo 2. Start MongoDB service
echo 3. Run 'npm run dev' in BackEnd directory
echo 4. Run 'npm run dev' in Front_End directory
echo.
echo Happy coding! 🚀
echo ========================================
pause