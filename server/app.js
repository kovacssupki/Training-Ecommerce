var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var User = require('./models/user-schema');
var Product = require('./models/product-schema');

// Connect to MongoDB and create/use database called ShoppingCart
mongoose.connect('mongodb://localhost/ShoppingCart');




// // Create models based on the schemas
// var Product = mongoose.model('Product', ProductSchema);
// var User = mongoose.model('User', UserSchema);

app.use('/', router);
app.use('/client', express.static(path.resolve(__dirname+ '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))


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
