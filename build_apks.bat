@echo off
echo ===================================================
echo   ORBIT Platform - Flutter APK Compiler Automation
echo ===================================================
echo.

set ROOT_DIR=%~dp0
set BUILD_DIR=%ROOT_DIR%Build_APKs

echo [1/4] Preparing build output directory...
if not exist "%BUILD_DIR%" (
    mkdir "%BUILD_DIR%"
)

echo.
echo [2/4] Building Client Application APK...
cd "%ROOT_DIR%client_app"
call flutter pub get
call flutter build apk --release
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Client build failed!
    exit /b %ERRORLEVEL%
)
copy "%ROOT_DIR%client_app\build\app\outputs\flutter-apk\app-release.apk" "%BUILD_DIR%\client-app-release.apk"

echo.
echo [3/4] Building Partner Application APK...
cd "%ROOT_DIR%partner_app"
call flutter pub get
call flutter build apk --release
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Partner build failed!
    exit /b %ERRORLEVEL%
)
copy "%ROOT_DIR%partner_app\build\app\outputs\flutter-apk\app-release.apk" "%BUILD_DIR%\partner-app-release.apk"

echo.
echo [4/4] Organizing deliverables...
echo Output directory: %BUILD_DIR%
dir "%BUILD_DIR%"

echo.
echo ===================================================
echo   Compilation complete! APKs generated successfully!
echo ===================================================
