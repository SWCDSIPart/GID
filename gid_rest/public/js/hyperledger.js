var cache = require('./cache.js');

exports.addNewGID = function(req,res){
  //TODO::
  var responseBody = {result:"OK",reason:"0"};
  var options = {
      //wallet_path: path.join(__dirname, '../../fintto-blockchain/basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore'),
      wallet_path: path.join(__dirname, '../../creds'),
      user_id: 'PeerAdmin',
      channel_id: 'mychannel',
      chaincode_id: 'globalid',
      peer_url: 'grpc://localhost:7051',
      event_url: 'grpc://localhost:7053',
      orderer_url: 'grpc://localhost:7050'
  };

  // TODO:: generate key
  //var key=req.body.Key;//'CAR10';
  //var d = new Date();
  var key = req.body.gid;
  var gid = req.body.gid;
  var username=req.body.username;
  var phone=req.body.phone;
  var publicKey=req.body.publicKey;
  var userStatus=req.body.userStatus;

  var channel = {};
  var client = null;
  var targets = [];
  var tx_id = null;

  Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
  }).then((wallet) => {
      console.log("Set wallet path, and associate user "+ options.user_id+ " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
  }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
          console.error("User not defined, or not enrolled - error");
      }
      channel = client.newChannel(options.channel_id);
      var peerObj = client.newPeer(options.peer_url);
      channel.addPeer(peerObj);
      channel.addOrderer(client.newOrderer(options.orderer_url));
      targets.push(peerObj);
      return;
  }).then(() => {
      tx_id = client.newTransactionID();
      console.log("Assigning transaction_id: "+ tx_id._transaction_id);
      // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
      // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
      // send proposal to endorser
      var request = {
          targets: targets,
          chaincodeId: options.chaincode_id,
          fcn: 'createID',
          args: [key,gid,username,phone,publicKey,userStatus],
          chainId: options.channel_id,
          txId: tx_id
      };
      return channel.sendTransactionProposal(request);
  }).then((results) => {
      var proposalResponses = results[0];
      var proposal = results[1];
      var header = results[2];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response &&
          proposalResponses[0].response.status === 200) {
          isProposalGood = true;
          console.log('transaction proposal was good');
      } else {
          console.error('transaction proposal was bad');
      }
      if (isProposalGood) {
          console.log(util.format(
              'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s"',
              proposalResponses[0].response.status, proposalResponses[0].response.message,
              proposalResponses[0].response.payload));
          var request = {
              proposalResponses: proposalResponses,
              proposal: proposal,
              header: header
          };
          // set the transaction listener and set a timeout of 30sec
          // if the transaction did not get committed within the timeout period,
          // fail the test
          var transactionID = tx_id.getTransactionID();
          var eventPromises = [];
          let eh = client.newEventHub();
          eh.setPeerAddr(options.event_url);
          eh.connect();
            let txPromise = new Promise((resolve, reject) => {
              let handle = setTimeout(() => {
                  eh.disconnect();
                  reject();
              }, 30000);
                eh.registerTxEvent(transactionID, (tx, code) => {
                  clearTimeout(handle);
                  eh.unregisterTxEvent(transactionID);
                  eh.disconnect();
                    if (code !== 'VALID') {
                      console.error(
                          'The transaction was invalid, code = ' + code);
                      reject();
                  } else {
                      console.log(
                          'The transaction has been committed on peer ' +
                          eh._ep._endpoint.addr);
                      resolve();
                  }
              });
          });
          eventPromises.push(txPromise);
          var sendPromise = channel.sendTransaction(request);
          return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
              console.log(' event promise all complete and testing complete');
              return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
          }).catch((err) => {
              console.error('Failed to send transaction and get notifications within the timeout period.');
              return 'Failed to send transaction and get notifications within the timeout period.';
          });
      } else {
          console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
          return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
      }
    }, (err) => {
        console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
            err);
        return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
            err;
    }).then((response) => {
        if (response.status === 'SUCCESS') {
        console.log('Successfully sent transaction to the orderer.');
        res.json(responseBody);
        return tx_id.getTransactionID();
    } else {
        console.error('Failed to order the transaction. Error code: ' + response.status);
        return 'Failed to order the transaction. Error code: ' + response.status;
    }
  }, (err) => {
        console.error('Failed to send transaction due to error: ' + err.stack ? err.stack : err);
        return 'Failed to send transaction due to error: ' + err.stack ? err.stack : err;
        res.status(500).send({error:"Caught Error"});
  });
};


  var Fabric_Client = require('fabric-client');
  var path = require('path');
  var util = require('util');
  var os = require('os');

  var fabric_client = new Fabric_Client();

  // setup the fabric network
  var channel = fabric_client.newChannel('mychannel');
  var peer = fabric_client.newPeer('grpc://localhost:7051');
  channel.addPeer(peer);

  //
  var store_path = path.join(__dirname, 'hfc-key-store');
  console.log('Store path:'+store_path);

  var member_user = null;
  var tx_id = null;


  // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
  Fabric_Client.newDefaultKeyValueStore({ path: store_path
  }).then((state_store) => {
  	// assign the store to the fabric client
  	fabric_client.setStateStore(state_store);
  	var crypto_suite = Fabric_Client.newCryptoSuite();
  	// use the same location for the state store (where the users' certificate are kept)
  	// and the crypto store (where the users' keys are kept)
  	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
  	crypto_suite.setCryptoKeyStore(crypto_store);
  	fabric_client.setCryptoSuite(crypto_suite);

  	// get the enrolled user from persistence, this user will sign all requests
  	return fabric_client.getUserContext('user1', true);
  }).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
  		console.log('Successfully loaded user1 from persistence');
  		member_user = user_from_store;
  	} else {
  		throw new Error('Failed to get user1.... run registerUser.js');
  	}

exports.queryGID = function(req,res){

    const request = {
  		//targets : --- letting this default to the peers assigned to the channel
  		chaincodeId: 'gid',
  		fcn: 'queryGID',
  		args: [req.params.gid]
  	};

    channel.queryByChaincode(request).then((query_responses) => {
  		console.log("Query has completed, checking results");
  		// query_responses could have more than one  results if there multiple peers were used as targets
  		if (query_responses && query_responses.length == 1) {
  			if (query_responses[0] instanceof Error) {
  				console.error("error from query = " + query_responses[0]);
  			} else {
          //console.log(query_responses[0].toString());
  				console.log("Response is " + query_responses[0].toString());
	 // if(req.params.gid < '4000'){
	 // 	cache.set(req.params.gid, query_responses[0].toString());
	 // 	console.log(req.params.gid+" < '8000' ::  map size :: "+ cache.size());
	 // }
          res.send(query_responses[0].toString());
  			}
  		} else {
  			console.log("No payloads were returned from query");
  		}

  	});

};

  }).catch((err) => {
    console.error('FAiled to query successfully :: ' + err);
  });
