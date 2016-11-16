var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./modules/host.js');
var jwt = require('./services/jwt.js');
var Product = require('./models/product-schema');


// Connect to MongoDB and create/use database called ShoppingCart
mongoose.connect('mongodb://localhost/ShoppingCart');


app.use('/', router);
app.use('/client', express.static(path.resolve(__dirname+ '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
})



app.get('/', function(req, res) {
  res.sendfile(path.resolve(__dirname+ '/../client/index.html'));
});


//Get products
app.get('/products', require('./modules/products.js'));

//Register user
app.post('/user/register', require('./modules/register.js'));

var jobs = [
  'Cook',
  'SuperHero',
  'Unicorn Whisperer',
  'Toast Inspector'
]
//Jobs
 app.get('/jobs', function(req, res){


   if(!req.headers.authorization){
     return res.status(401).send({
       message : "You are not authorized"
     });
   }

   var token = req.headers.authorization.split(" ")[1];
   var payload = jwt.decode(token, "shhh..");

   if(!payload.sub){
     res.status(401).send({message : "Authentication failed"})
   }

   res.json({ jobs: jobs, payload: payload});
 });

//Get users
app.get('/users', require('./modules/users.js'));

//Login
app.post('/user/login', require('./modules/login.js'));

//Confirm
app.post('/user/activate', require('./modules/confirm.js'))

// Cart create
app.post('/cart/:userid/create', require('./modules/cart.js'));


// Cart Get
// app.get('/cart/:username', function(req, res){
//   var Cart = require('./models/cart-schema');
//
//   // Cart.findOne({ userid : req.body.userid }, function(err, cart){
//   //   if(err) return err;
//   //   console.log(cart);
//   // })
//
// })




app.get('*',function (req, res) {
    res.redirect('/');
});




var server = require('http').createServer(app);
server.listen(config.port, config.host, function () {
  console.log('Server listening on: ' + config.host + ':' + config.port );
})
