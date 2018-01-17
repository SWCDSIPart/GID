var request = require('request');
var sleep = require('sleep');
var crypto=require('crypto');
var async=require('async');

async.whilst(function(){
  return true;
},
function(next){
  var d= new Date();
  var phone=d.getTime().toString();
  var gid = crypto.createHash('sha256').update(phone.toString()).digest('hex');
  var post_body={gid:gid,phone:phone,name:"MB",email:"mb@bluehouse.com"};
  console.log(post_body);
  request({
      url: 'http://13.124.21.200:3000/hyperledger/userRegistration',
      method: "POST",
      headers: {
          "content-type": "application/json",
      },
      json: post_body
    }, function(error, response, body){
          if(!error && response.statusCode == 200){
              console.log(JSON.stringify(body));
          }else{
            console.log("error");
          }
          next();
  });
  sleep.sleep(Math.floor(Math.random() * (4 - 1)) + 1);
},
function(err){});
