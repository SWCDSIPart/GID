var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var request = require('request');
var validator = require('./../public/js/validator.js');
var service = require('./../public/js/service.js');

router.post('/gid/:gid/bank', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.body));
    if(req.body) {
      var error=validator.bodyCheck(req, ['bankname','account','CI','primary']);
      if(!error){
        //TODO :: add logic
        service.bankAccountRegistration(req,res);
        res.send({result:'OK'});
      }else{
          res.status(405).send({error:'Invalid input'});
      }
    }else{
        res.status(405).send({error:"body is empty!!"});
    }
});

router.get('/gid/:gid/bank', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.params));
    var responseBody={
      "result": "Ok",
      "bank": "한국은행"
    };
    service.getUsersBank(req,res);
    res.send(responseBody);
});

router.delete('/gid/:gid/bank/:bankName', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.body));
    service.deleteUsersBankAccount(req,res);
    res.send({result:"OK"});
});

module.exports = router;
