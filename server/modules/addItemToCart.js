'use strict'

var exports = module.exports = function add(req, res){

  var jwt = require('./../services/jwt.js');

  var User = require('./../models/user-schema');

  var itemid = req.body.productid;

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;
  // console.log('payload', payload);
  // console.log(userid, itemid);

User.findOne({ _id: userid }, function(err, user){
  if(err) throw err;
  if(!user){
    return;
  }
  user.cart.push(itemid);


  console.log(user);
  user.save(function(err,user){
    if(err) throw err;
    res.send({ status : 'success'})
  });
})

  console.log("Req body is:",req.body)


}//exports var
