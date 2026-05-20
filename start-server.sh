#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js server..."
  node .next/standalone/server.js -p 3000 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s..."
  sleep 3
done
