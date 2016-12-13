'use strict'

var exports = module.exports = function confirm(req, res){

   var User = require('./../models/user-schema');
   var userId = req.body.userId;

  User.findOneAndUpdate({
    _id: userId, //this is the query
  }, {$set:{ isActive: false}}, { new: true}, //new:true will send us the updated user back
  function(err, newUser){
    if(err) throw err;
    else{
      console.log('Updated user is: ',newUser);
      res.send(newUser);
    }
  })


}
