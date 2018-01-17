#!/bin/bash

port=$(lsof -i tcp:3000 | grep node | awk '{print $2}')
if [ "$port" == "" ]; then
  exit
else
  echo "kill PID: $port"
  kill -9 $port
  sleep 3
fi

