echo "STEP 1. Kill gid-rest Server"
./node_kill.sh
sleep 1
echo "STEP 2. Start gid-rest Server"
nohup `DEBUG=gid-rest:* node ./bin/www >> test.log` &
sleep 3
echo "Starting Server..."

