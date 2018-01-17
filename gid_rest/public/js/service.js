var ledger = require('./hyperledger.js');
var mysql = require('./mysql-dao.js');
var cache = require('./cache.js');

exports.addNewGID = function(req,res){
  //TODO:: logic add
/*
    mysql.insert({gid: 'ABCD1234', phone: '01012341234'}, result => {});
*/
  ledger.addNewGID(req,res);
};

exports.findGIDbyPhone = function(req,res){
  //TODO:: logic add
  /*
   *   step 1: find gid by phoneNumber (mysql)

    mysql.query('phone', '01012341234', rows => { console.log(rows); });

   *   step 2: find data
  */
};

exports.queryDataByGID = function(req,res){
  //TODO:: logic add

/*
    mysql.query('gid', 'ABCD1234', rows => { console.log(rows); });
*/

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

/*
    mysql.update({gid:'ABCD1234', phone:'01056785678'}, result => {});
*/

};

exports.deleteGID = function(req,res){
  //TODO:: logic add
/*
    mysql.delete('gid', 'ABCD1234', result => {});
*/
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
