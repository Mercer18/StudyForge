@echo off
echo Starting StudyForge Backend (FastAPI)...
start "StudyForge Backend" cmd /k start_backend.bat

echo Starting StudyForge Frontend (Next.js)...
start "StudyForge Frontend" cmd /k start_frontend.bat

echo Both servers are booting up!
