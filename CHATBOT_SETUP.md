# Granules AI Chatbot - Setup Guide

## Prerequisites
- [Python 3.9+](https://python.org) (check "Add to PATH" during install)
- [Node.js 18+](https://nodejs.org)
- [Gemini API Key](https://makersuite.google.com/app/apikey)

## Quick Start (Windows)

### Step 1: Open Command Prompt
```
cd granules-india-website
```

### Step 2: Setup Backend
```
cd server
start.bat
```
- If prompted, edit `.env` file and paste your Gemini API key
- Server will start on `http://localhost:8001`

### Step 3: Setup Frontend (new terminal)
```
npm install
npm run dev
```

### Step 4: Open Browser
Go to `http://127.0.0.1:5173/` and click the blue chat bubble.

## Troubleshooting

**"Python not found"**
- Install Python from https://python.org
- During installation, check "Add Python to PATH"
- Restart command prompt

**"Address already in use"**
- Close other programs using port 8001 or 5173
- Or change PORT in `server\.env`

**Chatbot says "not set up yet"**
- Make sure backend server is running (terminal shows "Uvicorn running")
- Check `.env` has a valid GEMINI_API_KEY
