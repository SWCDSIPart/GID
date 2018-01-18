echo "STEP 1. Kill gid-rest Server"
./node_kill.sh
sleep 1
echo "STEP 2. Start gid-rest Server"
DEBUG=gid-rest:* node ./bin/www
sleep 2
echo "Starting Server..."

