@echo off
echo ===================================
echo  Granules AI Chatbot - Server Setup
echo ===================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.9+ from https://python.org
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

REM Check .env file
if not exist ".env" (
    echo Creating .env file...
    echo GEMINI_API_KEY=your_api_key_here > .env
    echo HOST=0.0.0.0 >> .env
    echo PORT=8001 >> .env
    echo.
    echo IMPORTANT: Edit server\.env and replace 'your_api_key_here' with your Gemini API key.
    echo Get one at: https://makersuite.google.com/app/apikey
    echo.
    notepad .env
    pause
)

REM Install dependencies
echo Installing Python dependencies (this may take a few minutes)...
pip install -r requirements.txt -q

REM Start server
echo.
echo Starting chatbot server on port 8001...
python -m uvicorn main:app --host 0.0.0.0 --port 8001
