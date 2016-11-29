'use strict'

var exports = module.exports = function order(req, res){

  var jwt = require('./../services/jwt.js');

  var Order = require('./../models/order-schema');
  var User = require('./../models/user-schema');

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;
  var username = payload.name;
  // console.log('username: ',username)

  var userInitialCart = [];

User.findById({ _id: userid }, function(err, user){
  if(err) throw err;
  if(!user){
    return;
  }
  // console.log('user found', user)

  userInitialCart = user.cart;

  user.cart = [];

  user.save(function(err,user){
    if(err) throw err;
  });

  var order = new Order({
    userId: userid,
    username: username,
    cart: userInitialCart
  })

  // console.log('order:', order);

  order.save(function(err,order){
    if(err) throw err;
    res.send({ status : 'success, saved order'})
  });


})//findquery





}//exports var
