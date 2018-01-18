var ledger = require('./hyperledger.js');
var mysql = require('./mysql-dao.js');
var cache = require('./cache.js');
var enrollRegister = require('./enrollAdminRegisterUser.js');
var config = require('./config');

exports.addNewGID = function(req,res){
  if(!config.mysql.use){
      ledger.addNewGID(req,res,'10.113.58.69','user2');
      return;
  }

  mysql.isExistGID(req.body.gid, result => {
    if(true){
      console.log('already exist!!!');
      res.status(500).send({result:'already Exist'});
    } else {
      mysql.insert({gid: req.body.gid, value: req.body.toString()}, result => {
        ledger.addNewGID(req,res,'10.113.58.69','user2');
        if(result == 'OK'){
        }else{
          console.log('insert fail!!!');
          res.status(500).send({result:'mysql insert fail'});
        }
      });
    }
  });
};

exports.findGIDbyPhone = function(req,res){
  mysql.query('phone', req.query.phone, rows => {
    if(rows){
      res.send(rows);
    }else{
      res.status(500).send({result:'not exist gid'});
    }
  });
};

exports.queryDataByGID = function(req,res){
  if(!config.mysql.use){
    ledger.queryGID(req,res,'10.113.58.69','user2');
    return;
  }

  mysql.queryGID(req.body.gid, rows => {
    if(rows){
      res.send(rows);
    }else{
      ledger.queryGID(req,res,'10.113.58.69','user2');
    }
  });
};

exports.updateGID = function(req,res){
  mysql.updateGID({gid:req.body.gid, value:req.body}, result => {
    if(result == 'OK'){
      ledger.updateGID(req,res);
    }else{
      res.status(500).send({result:'update Fail'});
    }
  });
};

exports.deleteGID = function(req,res){
  mysql.deleteGID(req.body.gid, result => {
      if(result == 'OK'){
        ledger.deleteGID(req,res);
      }else{
        res.status(500).send({result:"delete fail"});
      }
  });
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

exports.enrollRegister = function(req,res){
    enrollRegister.enrollAdminRegisterUser(req.params.ip, req.params.userName, res);
}
