'use strict'
var jwt = require('./../services/jwt.js');
var exports = module.exports = function register(req, res){

  var User = require('./../models/user-schema');

  var date = new Date();
  var activationCode = date.getTime();
  var user = req.body;

  var newUser = new User({

    name : user.name,
    email : user.email,
    username : user.username,
    password : user.password,
    repass : user.repass,
    address : user.address,
    activationCode : activationCode.toString()
  });


//create a payload with our user,and send it instead of the normal json newUser

  newUser.save(onSuccessCallback, onErrorCallback);
  function onSuccessCallback(err,doc){
    if(doc){

      //sendgrid email
      var helper = require('sendgrid').mail;
      // var sg = require('sendgrid')('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');
      var sg = require('sendgrid')('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');
      var from_email = new helper.Email('2016shoppingcart@gmail.com');
      var to_email = new helper.Email(newUser.email);
      var subject = 'Welcome to Mike\'s shopping cart! Confirm your email';
      var structure = require('./mail_structure.js');
      var content = new helper.Content('text/html', structure.create(newUser));
      var mail = new helper.Mail(from_email, subject, to_email, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function(error, response) {
        if(response.statusCode === 202){
          console.log('Success, mail sent!');
        }else{
          console.log('Invalid email address');
        }

      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      });


      createSendToken(newUser, res);
    }else{
      res.send({ error : err});
    }
  }//success

  function onErrorCallback(error){
    res.send({error: error});
  }//error

  function createSendToken(user, res){

    var payload = {
      sub: user.id
    }
    var token = jwt.encode(payload, "shhh..");

    res.send({
      user: user,
      token: token
    });
  }//fn createSendToken

}//fn
