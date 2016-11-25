'use strict'

var exports = module.exports = function (req, res){

  var Product = require('./../models/product-schema');
  var productId = req.params.id;
  // console.log('productId: ', productId);

Product.findOne({ _id: productId  }, function(err, product){
  if(err) throw err;
  if(!product){
    return;
  }

  product.remove(product);

})

}//exports var
