'use strict'
var jwt = require('./../services/jwt.js');
var exports = module.exports = function confirm(req, res){

  var Order = require('./../models/order-schema');
  var orderId = req.body.orderId;
  // console.log('orderId: ', orderId);

  Order.findOneAndUpdate({
    _id: orderId,    //this is the query
  }, {$set:{ confirmed: true}}, { new: true}, //new:true will send us the updated user back
  function(err, newOrder){
    if(err) throw err;
    else{
      // console.log('Updated order is: ',newOrder);
      res.send(newOrder);
    }
  })



}
