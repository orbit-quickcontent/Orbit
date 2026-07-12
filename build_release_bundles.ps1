# ===================================================
#   ORBIT Platform - Flutter App Bundle Builder
# ===================================================

# 1. Setup Java Environment (Using VS Code Extension's Embedded JRE 21)
$embeddedJava = "C:\Users\HP\.antigravity-ide\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64"
if (Test-Path $embeddedJava) {
    Write-Host "[1/6] Setting JAVA_HOME to embedded JDK 21: $embeddedJava"
    $env:JAVA_HOME = $embeddedJava
    $env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
} else {
    Write-Host "[1/6] Using system default JAVA_HOME: $env:JAVA_HOME"
}

# 2. Setup output directory
$buildDir = "$PSScriptRoot\Build_AppBundles"
Write-Host "[2/6] Preparing build output directory: $buildDir"
if (Test-Path $buildDir) {
    Remove-Item -Recurse -Force $buildDir
}
New-Item -ItemType Directory -Force $buildDir | Out-Null

# 3. Locate Flutter
$flutterCmd = "C:\Users\HP\flutter\bin\flutter.bat"
if (-not (Test-Path $flutterCmd)) {
    $flutterCmd = "flutter"
}
Write-Host "Using Flutter executable: $flutterCmd"

# 4. Build Client App Bundle
Write-Host "`n[3/6] Building Client Application App Bundle..."
cd "$PSScriptRoot\client_app"
& $flutterCmd pub get
& $flutterCmd build appbundle --release
if ($LASTEXITCODE -ne 0) {
    Write-Error "Client App Bundle build failed!"
    exit $LASTEXITCODE
}
Copy-Item "build\app\outputs\bundle\release\app-release.aab" "$buildDir\client-app-release.aab"

# 5. Build Partner App Bundle
Write-Host "`n[4/6] Building Partner Application App Bundle..."
cd "$PSScriptRoot\partner_app"
& $flutterCmd pub get
& $flutterCmd build appbundle --release
if ($LASTEXITCODE -ne 0) {
    Write-Error "Partner App Bundle build failed!"
    exit $LASTEXITCODE
}
Copy-Item "build\app\outputs\bundle\release\app-release.aab" "$buildDir\partner-app-release.aab"

# 6. Finalize
Write-Host "`n[5/6] Organizing deliverables..."
Get-ChildItem $buildDir

Write-Host "`n==================================================="
Write-Host "   Compilation complete! AABs generated successfully!"
Write-Host "==================================================="
cd $PSScriptRoot
