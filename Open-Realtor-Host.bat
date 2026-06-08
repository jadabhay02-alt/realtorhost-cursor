@echo off
REM One-time fix: open Realtor Host in Cursor with the correct folder path.
REM Double-click this file, or run from Explorer.

set PROJECT=C:\Users\jadab\Projects\realtor-host

if not exist "%PROJECT%\package.json" (
  echo ERROR: Realtor Host not found at %PROJECT%
  pause
  exit /b 1
)

echo Opening Realtor Host in Cursor...
echo Folder: %PROJECT%
echo.
echo If Cursor was using the old "keyvora" path, this opens the correct project.
echo.

where cursor >nul 2>&1
if %ERRORLEVEL%==0 (
  cursor "%PROJECT%\realtor-host.code-workspace"
) else (
  start "" "%PROJECT%\realtor-host.code-workspace"
)
