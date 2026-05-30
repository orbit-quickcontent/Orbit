#!/bin/bash
while true; do
  if ! ss -tlnp | grep -q ":3000 "; then
    echo "[$(date)] Starting server..." >> /home/z/my-project/watchdog.log
    npx next dev -p 3000 -H 0.0.0.0 >> /home/z/my-project/dev.log 2>&1 &
    sleep 8
  else
    echo "[$(date)] Server running" >> /home/z/my-project/watchdog.log
  fi
  sleep 5
done
