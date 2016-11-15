'use strict'

var exports = module.exports = function users(req, res){

  var User = require('./../models/user-schema');

  User.find(function (err, users) {
      if (err) return console.error(err);
      res.json({status:'success', users :users});
  });

}//fn
