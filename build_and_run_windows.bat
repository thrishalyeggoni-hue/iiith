@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo  QUANTUM ECHO: THE CITY THAT FORGOT
echo  Windows Automated Setup ^& Standalone Build Launcher
echo ======================================================================

REM Check PowerShell and run with ExecutionPolicy Bypass so it works on any Windows machine
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PowerShell not found on your system PATH.
    pause
    exit /b 1
)

echo Launching automated setup and build script via PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_and_run_windows.ps1"

if %errorlevel% neq 0 (
    echo.
    echo [NOTICE] Script finished with exit code %errorlevel%.
    echo If Unity was not located automatically, please check the Logs folder.
    pause
)
