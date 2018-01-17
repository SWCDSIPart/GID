echo "STEP 1. Kill hyperledger-rest Server"
./node_kill.sh
sleep 1
echo "STEP 2. Start hyperledger-rest Server"
nohup `DEBUG=hyperledger-rest:* node ./bin/www >> test.log` &
sleep 3
echo "Starting Server..."

