@echo off
echo Starting Volunteer Match Application...

echo Installing backend dependencies...
cd backend
call npm install

echo Starting backend server...
start "Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo Installing frontend dependencies...
cd ..\frontend
call npm install

echo Starting frontend server...
start "Frontend" cmd /k "npm run dev"

echo.
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit...
pause > nul