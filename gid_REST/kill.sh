#!/bin/bash

if pgrep -f "node ./bin/www" > /dev/null
then
    echo "Stopped"
    pkill -f "node ./bin/www"
else
    echo "Not running now"
fi
