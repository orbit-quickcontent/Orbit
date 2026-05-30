#!/bin/bash
# Persistent Orbit server - keeps running no matter what
LOG=/home/z/my-project/server.log
while true; do
  echo "[$(date)] Starting Next.js server..." >> $LOG
  node_modules/.bin/next start -p 3000 -H 0.0.0.0 >> $LOG 2>&1
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT, restarting in 2s..." >> $LOG
  sleep 2
done
