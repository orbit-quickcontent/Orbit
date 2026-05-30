#!/bin/bash
# Orbit App Server - Production mode with auto-restart watchdog
# Uses `next start` (production build) for lower memory usage
while true; do
  echo "[$(date)] Starting production server..." >> /home/z/my-project/watchdog.log
  cd /home/z/my-project
  node_modules/.bin/next start -p 3000 -H 0.0.0.0 >> /home/z/my-project/server.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s..." >> /home/z/my-project/watchdog.log
  sleep 3
done
