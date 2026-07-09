@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   ORBIT Platform - Kotlin Android APK Compiler
echo ===================================================
echo.

:: 1. Setup outputs directory
echo [1/4] Preparing build output directory...
if exist Build_Kotlin_APKs (
    rmdir /s /q Build_Kotlin_APKs
)
mkdir Build_Kotlin_APKs
echo.

:: 2. Compile Client App
echo [2/4] Building Client Android App...
cd android_client_app
call .\gradlew clean
call .\gradlew assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Client build failed!
    exit /b %ERRORLEVEL%
)
copy app\build\outputs\apk\debug\app-debug.apk ..\Build_Kotlin_APKs\client-app-release.apk > nul
cd ..
echo.

:: 3. Compile Partner App
echo [3/4] Building Partner Android App...
cd android_partner_app
call .\gradlew clean
call .\gradlew assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Partner build failed!
    exit /b %ERRORLEVEL%
)
copy app\build\outputs\apk\debug\app-debug.apk ..\Build_Kotlin_APKs\partner-app-release.apk > nul
cd ..
echo.

:: 4. Organize deliverables
echo [4/4] Organizing deliverables...
dir Build_Kotlin_APKs
echo.
echo ===================================================
echo   Compilation complete! APKs generated successfully!
echo ===================================================
pause
