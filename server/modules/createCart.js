'use strict'

var exports = module.exports = function cart(req, res){

  var Cart = require('./../models/cart-schema');

  var newCart = new Cart({
    userid: req.body.userid,
    items: req.body.items
  })

  newCart.save(onSuccessCallback,onErrorCallback)

}//exports var
