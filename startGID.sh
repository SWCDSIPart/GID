echo "***** 1. Starting Blockchain..."
cd gid_blockchain/gid/
./startFabric.sh 
cd -
echo "***** 2. Starting REST server..."
cd gid_rest/
./start.sh
