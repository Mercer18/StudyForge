@echo off
cd backend
set "Path=X:\CODING\codingPlatforms\Python Main;%Path%"
call .\venv\Scripts\activate.bat
uvicorn main:app --reload --port 8000
