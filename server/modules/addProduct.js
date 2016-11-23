'use strict'

var exports = module.exports = function add(req, res){


var Product = require('./../models/product-schema');

var product = req.body;

var newProduct = new Product({

  name : product.name,
  description : product.description,
  // imageUrl : user.username,
  price : product.price,
  instock : product.instock,

});
newProduct.save(onSuccessCallback,onErrorCallback)

function onSuccessCallback(err,doc){
  res.send(doc);
}
function onErrorCallback(error){
  res.send({error: error});
}//error

}//exports var
