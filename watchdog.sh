#!/bin/bash
cd /home/z/my-project
while true; do
  npx next start -p 3000 2>&1
  echo "[$(date)] Server crashed, restarting in 2s..." 
  sleep 2
done
