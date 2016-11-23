'use strict'

var exports = module.exports = function add(req, res){

  var Order = require('./../models/order-schema');

  Order.find(function (err, orders) {
      if (err) return console.error(err);
      res.send({status:'success', orders: orders});
  });


}//exports var
