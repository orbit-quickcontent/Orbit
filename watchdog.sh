#!/bin/bash
# Orbit server watchdog - keeps the server alive
while true; do
  if ! ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "[$(date)] Starting server..." >> /home/z/my-project/watchdog.log
    node_modules/.bin/next start -p 3000 -H 0.0.0.0 >> /home/z/my-project/server.log 2>&1 &
    SERVER_PID=$!
    echo "[$(date)] Server PID: $SERVER_PID" >> /home/z/my-project/watchdog.log
    sleep 5
    # Check if still alive
    if kill -0 $SERVER_PID 2>/dev/null; then
      echo "[$(date)] Server is running" >> /home/z/my-project/watchdog.log
    else
      echo "[$(date)] Server died quickly, restarting in 3s..." >> /home/z/my-project/watchdog.log
      sleep 3
    fi
  else
    # Server is running, just monitor
    sleep 3
  fi
done
