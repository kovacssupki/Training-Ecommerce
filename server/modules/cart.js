'use strict'

var exports = module.exports = function cart(req, res){

  var Cart = require('./../models/cart-schema');

  var newCart = new Cart({
    userid: req.body.userid,
    items: req.body.items
  })

  console.log("Req body is:",req.body)

  newCart.save(onSuccessCallback,onErrorCallback);

    function onSuccessCallback(err, doc){
      if(doc){
        res.status(202).send(doc);
      }else{
        res.status(400).send(err);
      }

    }
    function onErrorCallback(error){
      res.status(400);
      res.send({error: error});
    }

}//exports var
