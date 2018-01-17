var ledger = require('./hyperledger.js');

var cache = require('./cache.js');

exports.addNewGID = function(req,res){
  //TODO:: logic add
  ledger.addNewGID(req,res);
};

exports.findGIDbyPhone = function(req,res){
  //TODO:: logic add
  /*
   *   step 1: find gid by phoneNumber (mysql)
   *   step 2: find data
  */
};

exports.queryDataByGID = function(req,res){
  //TODO:: logic add
  //ledger.queryDataByGID(req,res);
  if(cache.get(req.params.gid)){
	console.log('find cache');
	res.send(cache.get(req.params.gid));
  }else{
  	ledger.queryGID(req,res);
  }
};

exports.updateGID = function(req,res){
  //TODO:: logic add
};

exports.deleteGID = function(req,res){
  //TODO:: logic add
};

exports.bankAccountRegistration = function(req,res){
  //TODO:: logic add
};

exports.getUsersBank = function(req,res){
  //TODO:: logic add
};

exports.deleteUsersBankAccount = function(req,res){
  //TODO:: logic add
};
