'use strict'
var jwt = require('./../services/jwt.js');
var exports = module.exports = function login(req, res){

  var User = require('./../models/user-schema');

  req.user = req.body;

  function createSendToken(user, res){

    var payload = {
      sub: user.id,
      name: user.username
    }

    var token = jwt.encode(payload, "shhh..");

    res.status(202).send({
      user: user,
      token: token
    });
  }//fn createSendToken

  var searchUser = { username : req.user.username };

  User.findOne(searchUser, function(err, user){
    if (err) throw err;

    if(!user){
      return res.status(401).send({ message:'Wrong email/password'});
    }
    user.comparePasswords(req.user.password, function(err, isMatch){
      if(err) throw err;

      if(!isMatch){
        return res.status(401).send({ message:'Wrong email/password'});
      }
      createSendToken(user, res);
    })
  })

}
