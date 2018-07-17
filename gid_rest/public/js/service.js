var ledger = require('./hyperledger.js');
var mysql = require('./mysql-dao.js');
var cache = require('./cache.js');
var enrollRegister = require('./enrollAdminRegisterUser.js');
var config = require('./config');

//var localIP = '127.0.0.1';
var localIP = '192.168.0.191';
var testUser = 'user1';

exports.addNewGID = function(req,res){
  if(!config.mysql.use){
      // return;
      ledger.invokeGID(req,res,localIP, testUser,'CREATE');
      return ;
  }

  mysql.isExistGID(req.body.gid, result => {
    if(true){
      console.log('already exist!!!');
      res.status(500).send({result:'already Exist'});
    } else {
      mysql.insert({gid: req.body.gid, value: req.body.toString()}, result => {
        ledger.invokeGID(req, res, localIP, testUser,'CREATE');
        if(result == 'OK'){
        }else{
          console.log('insert fail!!!');
          res.status(500).send({result:'mysql insert fail'});
        }
      });
    }
  });
};


exports.queryDataByGID = function(req,res){
  if(!config.mysql.use){
    return ledger.queryGID(req,res, localIP, testUser);
  }

  mysql.queryGID(req.body.gid, rows => {
    if(rows){
      res.send(rows);
    }else{
      ledger.queryGID(req,res, localIP, testUser);
    }
  });
};

exports.queryDevicesByGID = function(req,res){
  if(!config.mysql.use){
    return ledger.queryDevicesByGID(req,res, localIP, testUser);
  }
};

exports.updateGID = function(req,res){
  if(!config.mysql.use){
    ledger.invokeGID(req,res, localIP, testUser, 'UPDATE');
    return;
  }

  mysql.updateGID({gid:req.body.gid, value:req.body}, result => {
    if(result == 'OK'){
      ledger.invokeGID(req,res, localIP, testUser, 'UPDATE');
    }else{
      res.status(500).send({result:'update Fail'});
    }
  });
};

exports.deleteGID = function(req,res){
  if(!config.mysql.use){
    ledger.invokeGID(req,res, localIP, testUser,'DELETE');
    return;
  }

  mysql.deleteGID(req.body.gid, result => {
      if(result == 'OK'){
        ledger.invokeGID(req,res, localIP, testUser,'DELETE');
      }else{
        res.status(500).send({result:"delete fail"});
      }
  });
};

exports.setParent = function(req,res){
  ledger.invokeGID(req, res, localIP, testUser,'SETPARENT');
  if(result == 'OK'){
  }else{
    res.status(500).send({result:'Ok'});
  }
};


exports.enrollRegister = function(req,res){
    enrollRegister.enrollAdminRegisterUser(req.params.ip, req.params.userName, res);
}
