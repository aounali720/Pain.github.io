@echo off
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel% equ 0 (
  start "" "http://localhost:8000"
  py -m http.server 8000
) else (
  start "" "http://localhost:8000"
  python -m http.server 8000
)
pause