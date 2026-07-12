@echo off
title Push to GitHub - Orbit Marketplace
echo ==============================================
echo   Pushing Orbit Marketplace to GitHub...
echo ==============================================
echo.

echo [1/3] Adding files to git index...
git add .

echo.
echo [2/3] Creating commit...
git commit -m "feat: orbit production readiness implementation"

echo.
echo [3/3] Uploading changes to GitHub...
git push origin main

echo.
echo ==============================================
echo   Push completed successfully!
echo ==============================================
echo.
pause
