'use strict'

var exports = module.exports = function (req, res){

  var Product = require('./../models/product-schema');
  // var productId = req.params.id;
  var product = req.body;
  // console.log("product is: ", product);
  Product.findOneAndUpdate({
    _id: product._id, //this is the query
  },
  {$set:{ name: product.name,
    description: product.description,
    instock: product.instock,
    price: product.price}}, { new: true}, //new:true will send us the updated user back

  function(err, newProduct){
    if(err) throw err;
    else{
      console.log('Updated product is: ',newProduct);
      res.send(newProduct);
    }
  })

}//exports var
