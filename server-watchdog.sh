#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS="--max-old-space-size=256" npx next start -p 3000
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT, restarting in 3s..." >> /tmp/server-watchdog.log
  sleep 3
done
