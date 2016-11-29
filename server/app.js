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

var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');   //File System - for file manipulation



// Connect to MongoDB and create/use database called ShoppingCart
mongoose.connect('mongodb://localhost/ShoppingCart');

app.use(busboy());
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

//Cart Get
app.get('/cart/:userid', require('./modules/getcart.js'))

// Cart create/Get
app.post('/cart/:userid/create', require('./modules/cart.js'));

// Cart add Item
app.post('/cart/:userid/additem/:itemid', require('./modules/addItemToCart.js'))

//Cart delete Item
app.delete('/cart/:userid/removeitem/:itemid', require('./modules/removeItemCart.js'))

//Activate - final step
app.put('/activate/:activationCode', require('./modules/confirm.js'));

// ORDERS
app.get('/order/:userid/create', require('./modules/createOrder.js'))
app.get('/orders/:userid/list', require('./modules/getOrders.js'))
app.get('/orders/:userid', require('./modules/myOrders.js'))
app.put('/order/:orderid/confirm', require('./modules/confirmOrder.js'))
app.put('/order/:orderid/reject', require('./modules/rejectOrder.js'))


// Add Product - ADMIN
app.post('/product/create', require('./modules/addProduct.js'))
// Upload - ADMIN
app.post('/uploads', require('./modules/upload.js'))
// Delete product - ADMIN
app.delete('/product/:id/delete', require('./modules/deleteProduct.js'))
// Edit product - ADMIN
app.put('/product/:id/edit', require('./modules/editProduct.js'))




app.get('*',function (req, res) {
    res.redirect('/');
});


var server = require('http').createServer(app);
server.listen(config.port, config.host, function () {
  console.log('Server listening on: ' + config.host + ':' + config.port );
})
