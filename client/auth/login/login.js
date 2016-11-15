// 'use strict'
//
// var exports = module.exports = function login(req, res){
//
//   var User = require('server/models/user-schema');
//
//   req.user = req.body;
//
//   var searchUser = { username: req.user.username };
//
//   User.findOne(searchUser, function(err, user){
//     if (err) throw err;
//
//     if(!user){
//       return res.status(401).send({ message:'Wrong email/password'});
//     }
//     user.comparePasswords(req.user.password, function(err, isMatch){
//       if(err) throw err;
//
//       if(isMatch){
//         return res.status(401).send({ message:'Wrong email/password'});
//       }
//       createSendToken(user, res);
//     })
//   })
//
//   function createSendToken(user, res){
//     var payload = {
//       sub: user.id
//     }
//     var token = jwt.encode(payload, "shhh..");
//
//     res.status(202).send({
//       user: user,
//       token: token
//     });
//   }//fn createSendToken
// }
