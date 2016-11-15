'use strict'

var exports = module.exports = function user(req, res){

  var User = require('./../models/user-schema');

  // User.findOne(function (err, user) {
  //     if (err) return console.error(err);
  //     res.json({status:'success', user :user});
  // });
  User.findOne({
    _id: '5825b14928f9cc1f28c12920'
  }, function(err, user){
    if(err) return console.error(err);
    res.send({status: 'success', user: user});
  })

  // })

}//fn
