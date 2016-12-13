'use strict'
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var exports = module.exports = function reset(req, res){

   var User = require('./../models/user-schema');
   var userId = req.body.userId;

   var genPass = crypto.randomBytes(20).toString('hex');
   console.log("genPass", genPass);

   var salt = bcrypt.genSaltSync(10);
   var hashedPass = bcrypt.hashSync(genPass, salt);
   console.log("hashedPass", hashedPass);

  User.findOneAndUpdate({
    _id: userId, //this is the query
  }, {$set:{ password: hashedPass}}, { new: true}, //new:true will send us the updated user back
  function(err, newUser){
    if(err) throw err;
    else{
      console.log('Updated user is: ',newUser);
      // //sendgrid email
      var helper = require('sendgrid').mail;
      var sg = require('sendgrid')('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');
      var from_email = new helper.Email('2016shoppingcart@gmail.com');
      var to_email = new helper.Email(newUser.email);
      var subject = 'Password reset notification - ShoppingCart';
      var structure = require('./mail_structure_reset.js');
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
      res.send(newUser);
    }
  })





}
