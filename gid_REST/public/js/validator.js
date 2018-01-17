exports.bodyCheck = function (req, array){
  for(var i=0;i<array.length;i++){
    req.checkBody(array[i], 'invalid '+array[i]).notEmpty();
  }
  return req.validationErrors();
};

exports.isExistBody = function(body){
  if(body) return true;
  else return false;
};

exports.isExistPhoneNumber = function(phone){
  if(phone) return true;
  else return false;
};
