'use strict'

var exports = module.exports = function add(req, res){

  var jwt = require('./../services/jwt.js');

  var User = require('./../models/user-schema');

  var itemid = req.body.productid;

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;

User.findOne({ _id: userid }).populate("cart", "name imageUrl price instock" ).exec(function(err, user){

  if(err) throw err;
  if(!user){
    return;
  }

  // var populated = User.populate(user,{ path: ,model:});

  res.send({ user: user})

  console.log(user);

})

  console.log("Req body is:",req.body)


}//exports var
