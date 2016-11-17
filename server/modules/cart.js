'use strict'

var exports = module.exports = function cart(req, res){

  var Cart = require('./../models/cart-schema');

  Cart.find({ userid: req.body.userid}, function(err, result){
    if(err) throw err;

    if(!result.length){
      var newCart = new Cart({
        userid: req.body.userid,
        items: req.body.items
      })
      newCart.save(onSuccessCallback,onErrorCallback);

      function onSuccessCallback(err, doc){
        if(doc){
          res.send(doc);
        }else{
          res.send(err);
        }
      }
      function onErrorCallback(error){
        res.send({error: error});
      }
    }else{
      res.status(200).send(result[0]);
    }

  })



  // console.log("Req body is:",req.body)





}//exports var
