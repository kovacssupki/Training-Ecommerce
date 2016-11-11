var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./modules/host.js');

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


//Get products
app.get('/products', require('./modules/products.js'));

//Register user
app.post('/user/register', require('./modules/register.js'));

//Create Cart
// app.post('/user/:userid/cart/create', require('./modules/createCart.js'));

//Get users
app.get('/users', require('./modules/users.js'));
//Get user
app.get('/user/:userid', require('./modules/user.js'));


app.get('*',function (req, res) {
    res.redirect('/');
});


// app.listen(3000, function () {
//   console.log('Server listening on port 3000!');
// });
var server = require('http').createServer(app)
server.listen(config.port, config.host, function () {
  console.log('Server listening on: ' + config.host + ':' + config.port );
})
