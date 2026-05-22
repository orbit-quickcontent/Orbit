#!/bin/bash
cd /home/z/my-project
(while true; do
  bun run dev 2>&1
  echo "[$(date)] Server died, restarting in 3s..." >> /home/z/my-project/daemon.log
  sleep 3
done) &
echo $! > /home/z/my-project/daemon.pid
exit 0
