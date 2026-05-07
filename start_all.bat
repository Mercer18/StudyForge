@echo off
echo Starting StudyForge Backend (FastAPI)...
start cmd /k "cd backend && set Path=X:\CODING\codingPlatforms\Python Main;%Path% && .\venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo Starting StudyForge Frontend (Next.js)...
start cmd /k "cd frontend && set Path=X:\CODING\codingPlatforms\Nodejs\node-v20.11.0-win-x64;%Path% && npm run dev"

echo Both servers are booting up in new windows!
