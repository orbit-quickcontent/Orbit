#!/bin/bash
cd /home/z/my-project

# Kill any existing server
pkill -f "next dev" 2>/dev/null || true
sleep 1

# Clear any corrupted caches
rm -rf .next 2>/dev/null || true

# Install dependencies
bun install

# Push database schema
bun run db:push

# Start the dev server with webpack (Turbopack crashes in this environment)
node node_modules/.bin/next dev -p 3000 --webpack 2>&1 | tee -a dev.log
