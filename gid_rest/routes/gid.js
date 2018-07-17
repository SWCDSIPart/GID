var express = require('express');
var router = express.Router();
var hfc = require('fabric-client');
var request = require('request');
var validator = require('./../public/js/validator.js');
var service = require('./../public/js/service.js');

router.post('/gid', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.body));
    if(validator.isExistBody(req.body)) {
      var error=validator.bodyCheck(req, ['type']);
      if(!error){
        service.addNewGID(req,res);
      }else{
        res.status(405).send({error:'Invalid input'});
      }
    }else{
        res.status(405).send({error:"body is empty!!"});
    }
});

router.get('/gid', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.query));
    if(validator.isExistPhoneNumber(req.query.phone)) {
     // var gid='08a4d1db1438ff353fa5e8b29830b4088377898568ca47a50eb7e386453e3aa8';
      var gid='308c28be168539b706a3cc965e1d124b1efaeae27c1ad5a627a5c1cdf2a19821';
      service.findGIDbyPhone(req,res);
      res.send({result:'ok',gid:gid});
    }else{
      res.status(500).send({error:"Invalid parameters"})
    }

});

router.get('/gid/:gid', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.params));
    var responseBody = {
      "gid": "string",
      "username": "string",
      "phone": "string",
      "publicKey": "string",
      "userStatus": 0
    };
    service.queryDataByGID(req,res)
      .then(result => {
					res.send(result);
      });
    //res.send(responseBody);
});

router.post('/gid/:gid', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.body));
    if(validator.isExistBody(req.body)) {
      var error=validator.bodyCheck(req, ['gid', 'type']);
      if(!error){
        //TODO :: add logic
        service.updateGID(req,res);
        // res.send({result:'OK'});
      }else{
          res.status(405).send({error:'Invalid input'});
      }
    }else{
        res.status(405).send({error:"body is empty!!"});
    }
});

router.delete('/gid/:gid', function(req, res, next) {
    console.log("recv >>"+JSON.stringify(req.params));
    service.deleteGID(req,res);
    //res.send({result:'OK'});
});

router.get('/gid/:gid/parent', function(req, res, next) {
  console.log("recv >>"+JSON.stringify(req.params));
  service.queryDataByGID(req,res)
    .then(result => {
      res.send({ parent: result.parent });
    });
});

router.post('/gid/:gid/parent', function(req, res, next) {
  console.log("recv >>"+JSON.stringify(req.params));
  service.setParent(req,res);
});

router.get('/gid/:gid/children', function(req, res, next) {
  console.log("recv >>"+JSON.stringify(req.params));
  service.queryDataByGID(req,res)
    .then(result => {
      res.send({ children: result.children });
    });
});

router.get('/gid/:gid/devices', function(req, res, next) {
  console.log("recv >>"+JSON.stringify(req.params));
  service.queryDevicesByGID(req,res)
    .then(result => {
      res.send(result);
    });
});

router.get('/enrollRegister/:ip/:userName', function(req, res,next){
  service.enrollRegister(req,res);
});
module.exports = router;
