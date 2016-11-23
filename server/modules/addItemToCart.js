'use strict'

var exports = module.exports = function add(req, res){

  var jwt = require('./../services/jwt.js');

  var User = require('./../models/user-schema');

  console.log("Req body is:",req.body.productId)
  var itemId = req.body.productId;
  var productQuantity = req.body.quantity;
  var itemName = req.body.itemName;
  console.log(itemName);

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "shhh..");
  var userid = payload.sub;

User.findOne({ _id: userid }, function(err, user){
  if(err) throw err;
  if(!user){
    return;
  }
  var item = {
    itemId: itemId,
    quantity: productQuantity,
    itemName: itemName
  }


//Check if cart is empty, if so, push item.
//If cart not empty, check if id exists,then update quantity, if not push it
if(!user.cart.length){
  user.cart.push(item);
}else{
  var isPushed = false;
  user.cart.forEach(function(i){
    if(i.itemId == item.itemId){
      var quantity = i.quantity + item.quantity;
      i.quantity = quantity;
      isPushed = true;
      return;
    }
  })
  if(!isPushed){
    user.cart.push(item);
  }
}

  user.save(function(err,user){
    if(err) throw err;
    res.send({ status : 'success'})
    });
  })




}//exports var
