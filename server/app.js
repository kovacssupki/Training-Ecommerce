var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Product = require('./models/product-schema');
var jwt = require('./services/jwt.js');
//sendgrid
// var sg = require('sendgrid').SendGrid('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');
 //sendgrid api key : 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

// Connect to MongoDB and create/use database called ShoppingCart
mongoose.connect('mongodb://localhost/ShoppingCart');



app.use('/', router);
app.use('/client', express.static(path.resolve(__dirname+ '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))

app.get('/', function(req, res) {
  res.sendfile(path.resolve(__dirname+ '/../client/index.html'));
});

// Find all data in the Todo collection
app.get('/products', function(req, res){

  Product.find(function (err, products) {
    if (err) return console.error(err);
    res.json({status:'success', products:products});
  });
})


//Register user
app.post('/user/register', function(req, res){

  var User = require('./models/user-schema');
  var newUser = new User();
  var date = new Date();
  var activationCode = date.getTime();


  var payload = {
    iss: req.hostname,
    sub: newUser._id,
  }

  var token = jwt.encode(payload, "shhh..");

  console.log('Req.body is',req.body);
  console.log('NewUser is:', newUser);


  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.address = req.body.address;
  newUser.activationCode = activationCode.toString();

  newUser.save(onSuccessCallback,onErrorCallback);

  function onSuccessCallback(err,doc){
    if(doc){
      // res.send({
      //   user: newUser,
      //   token: token
      // });
      res.json({submitted: true});
    }
  }//success

  function onErrorCallback(error){
    res.status(400);
    res.send({error: error});
  }//error

  var helper = require('sendgrid').mail;
  var sg = require('sendgrid')('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');


  var mail = helper.Mail(new helper.Email("2016shoppingcart@gmail.com"),"Sending with SendGrid is Fun", new helper.Email(newUser.email),new helper.Content('text/plain',"and easy to do anywhere, even with Node.js"));
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});

});//post req end











app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('*',function (req, res) {
        res.redirect('/');
});

// console.log(jwt.encode('hi', 'secret'));

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
