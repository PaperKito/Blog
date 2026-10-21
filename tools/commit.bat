@echo off
chcp 65001 >nul
title Blog Release Repo - Manual Commit
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0commit.ps1"
echo.
pause
