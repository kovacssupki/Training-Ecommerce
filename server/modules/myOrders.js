'use strict'

var exports = module.exports = function add(req, res){

  var Order = require('./../models/order-schema');

  var jwt = require('./../services/jwt.js');
  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;

  // console.log('user id :', userid);

  Order.find({ userId: userid }, function (err, orders) {
      if (err) return console.error(err);
      
      res.send({status:'success', orders: orders});
  });


}//exports var
