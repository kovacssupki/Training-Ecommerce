'use strict'

var exports = module.exports = function removeItem(req, res){

  var jwt = require('./../services/jwt.js');

  var User = require('./../models/user-schema');

  var itemid = req.params.itemid;
  console.log('itemId is: ',itemid);
  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;


User.findOne({ _id: userid }, function(err, user){
  if(err) throw err;
  if(!user){
    return;
  }

  // console.log(itemid);

  user.cart.remove(itemid);
  user.save(function(err, user){
    if(err) throw err;
    res.send({ status : 'deleted successfully'});
  })


})



}//exports var
