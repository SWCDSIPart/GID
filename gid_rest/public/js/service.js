var ledger = require('./hyperledger.js');
var mysql = require('./mysql-dao.js');
var cache = require('./cache.js');
var enrollRegister = require('./enrollAdmin.js');

exports.addNewGID = function(req,res){
  mysql.query('gid', req.body.gid, rows => {
    if(rows){
      console.log('already exist!!!');
      res.status(500).send({result:'already Exist'});
    } else {
      mysql.insert({gid: req.body.gid, phone: req.body.toString()}, result => {
        if(result){
          ledger.addNewGID(req,res);
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
  mysql.query('gid', req.body.gid, rows => {
    if(rows){
      res.send(rows);
    }else{
      ledger.queryGID(req,res);
    }
  });
};

exports.updateGID = function(req,res){
  mysql.update({gid:req.body.gid, phone:req.body}, result => {
    if(result){
      ledger.updateGID(req,res);
    }else{
      res.status(500).send({result:'update Fail'});
    }
  });
};

exports.deleteGID = function(req,res){
  mysql.delete('gid', req.body.gid, result => {
      if(result){
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
    enrollRegister.enrollAdmin(req.params.userName);
}
