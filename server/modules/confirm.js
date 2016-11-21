'use strict'
var jwt = require('./../services/jwt.js');
var exports = module.exports = function confirm(req, res){

   var User = require('./../models/user-schema');
   var code = req.body.code;

  User.findOneAndUpdate({
    activationCode: code, //this is the query
  }, {$set:{ isActive: true}}, { new: true}, //new:true will send us the updated user back
  function(err, newUser){
    if(err) throw err;
    else{
      console.log('Updated user is: ',newUser);
      res.send(newUser);
    }
  })



}
