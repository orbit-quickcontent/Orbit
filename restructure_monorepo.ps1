# PowerShell Script to Restructure codebase into monorepo layout

Write-Host "Starting Monorepo Restructuring..."

# Create folders
New-Item -ItemType Directory -Path "apps" -Force | Out-Null
New-Item -ItemType Directory -Path "packages" -Force | Out-Null
New-Item -ItemType Directory -Path "packages/shared-types" -Force | Out-Null
New-Item -ItemType Directory -Path "packages/shared-types/src" -Force | Out-Null
New-Item -ItemType Directory -Path "packages/shared-ui" -Force | Out-Null
New-Item -ItemType Directory -Path "packages/shared-ui/src" -Force | Out-Null

# Helper to safe-move
function Safe-Move($source, $dest) {
    if (Test-Path $source) {
        Write-Host "Moving $source -> $dest"
        # Ensure parent exists
        $parent = Split-Path $dest
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Move-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
    }
}

# Move apps
Safe-Move "dashboard-web-app" "apps/web-client"
Safe-Move "editor-web-app" "apps/web-editor"
Safe-Move "backend" "apps/backend-api"
Safe-Move "client_app" "apps/mobile-client"
Safe-Move "partner_app" "apps/mobile-partner"
Safe-Move "orbit_client/backend/mini-services/orbit-ws" "apps/websocket-node"

# Cleanup redundant files/directories
if (Test-Path "orbit_client") {
    Remove-Item -Recurse -Force "orbit_client" -ErrorAction SilentlyContinue
}

# Delete the Python websocket server in the moved path
$pythonWs = "apps/backend-api/src/services/websocket_server.py"
if (Test-Path $pythonWs) {
    Write-Host "Deleting redundant Python WebSocket daemon script: $pythonWs"
    Remove-Item -Force $pythonWs -ErrorAction SilentlyContinue
}

# Clean old node_modules
Write-Host "Cleaning local node_modules..."
Get-ChildItem -Path . -Filter "node_modules" -Recurse -Directory | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Restructure complete! Ready for workspace installation."
