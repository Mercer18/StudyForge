@echo off
cd backend
set "Path=X:\CODING\codingPlatforms\Python Main;%Path%"
call .\venv\Scripts\activate.bat
set PYTHONUTF8=1
uvicorn main:app --reload --port 8085
