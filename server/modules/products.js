'use strict'

var exports = module.exports = function products(req, res){

  var Product = require('./../models/product-schema');

  Product.find(function (err, products) {
      if (err) return console.error(err);
      res.send({status:'success', products:products});
  });

}//fn
