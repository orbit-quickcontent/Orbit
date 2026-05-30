#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js server..."
  setsid next start -p 3000 0</dev/null >> /tmp/nextjs.log 2>&1 &
  SERVER_PID=$!
  echo "[$(date)] Server PID: $SERVER_PID"
  wait $SERVER_PID
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s..."
  sleep 3
done
