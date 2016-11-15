var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
<<<<<<< HEAD
var config = require('./modules/host.js');
var jwt = require('./services/jwt.js');
=======
// var User = require('./models/user-schema');
var Product = require('./models/product-schema');
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3

// Connect to MongoDB and create/use database called ShoppingCart
mongoose.connect('mongodb://localhost/ShoppingCart');



<<<<<<< HEAD
=======

// // Create models based on the schemas
// var Product = mongoose.model('Product', ProductSchema);
// var User = mongoose.model('User', UserSchema);

>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
app.use('/', router);
app.use('/client', express.static(path.resolve(__dirname+ '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))
<<<<<<< HEAD
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
app.get('/cart/:username', function(req, res){
  var Cart = require('./models/cart-schema');

  Cart.findOne({ userid : req.body.userid }, function(err, cart){
    if(err) return err;
    console.log(cart);
  })

})




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
=======


router.get('/', function(req, res) {
  res.sendfile(path.resolve(__dirname+ '/../client/index.html'));
});

// Find all data in the Todo collection
router.get('/products', function(req, res){

  Product.find(function (err, products) {
    if (err) return console.error(err);
    res.json({status:'success', products:products});
  });
})

router.post('/user/register', function(req, res){
  var User = require('./models/user-schema');
  // var newUser = new User({
  //   // name:'mike',
  //   // email:'jones@gmail.com',
  //   // username:'mikeyy',
  //   // password:'123',
  //   // repass:'123',
  //   // address: {
  //   //   street:'campului',
  //   //   city:'cluj',
  //   //   county:'cluj-napoca',
  //   //   zipcode:'400425'}
  //
  // });
  var newUser = new User({});
  console.log(req.body);
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.repassword = req.body.repassword;
  newUser.address = req.body.address;

  newUser.save(function(err, newUser){
    if(err){
      res.send('error registering user');
    }else{
      console.log(newUser);
      res.send(newUser);
    }
  })//save

});











app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('*',function (req, res) {
        res.redirect('/');
});


app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
