'use strict'

var exports = module.exports = function add(req, res){

  var Order = require('./../models/order-schema');


    var jwt = require('./../services/jwt.js');
    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, "shhh..");
    var userid = payload.sub;

    // console.log(userid);

    if(userid ==='58358c03abe49411b46c792a'){

      Order.find(function (err, orders) {
        if (err) return console.error(err);
        res.send({status:'success', orders: orders});
      });

    }else{
      res.send({status:'fail', orders: null})
    }


}//exports var
