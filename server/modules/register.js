'use strict'
var jwt = require('./../services/jwt.js');
var exports = module.exports = function email(req, res){

  var User = require('./../models/user-schema');
  var date = new Date();
  var activationCode = date.getTime();
  var newUser = new User({
    name : req.body.name,
    email : req.body.email,
    username : req.body.username,
    password : req.body.password,
    address : req.body.address,
    activationCode : activationCode.toString()
  });



  var payload = {
    iss: req.hostname,
    sub: newUser._id,
  }

  var token = jwt.encode(payload, "shhh..");

  // console.log('Req.body is',req.body);
  // console.log('NewUser is:', newUser);

  newUser.save(onSuccessCallback, onErrorCallback);
  function onSuccessCallback(err,doc){
    if(doc){

      //sendgrid email
      var helper = require('sendgrid').mail;
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
          console.log('Success');
        }else{
          console.log('Invalid email address');
        }

      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      });

      res.send({ message: 'ok'});
    }else{
      res.send({ error : err});
    }
  }//success

  function onErrorCallback(error){
    res.status(400);
    res.send({error: error});
  }//error


}//fn
