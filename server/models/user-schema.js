'use strict';
<<<<<<< HEAD
var exports = module.exports = (function(){
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
=======
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3

//Create a schema
var UserSchema = new Schema({
  name: { type: String, required: true },
<<<<<<< HEAD
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true},
  isActive: { type : Boolean, default : false},
  activationCode : { type: String},
  password: { type: String, required: true },
  address: { street: String,
=======
  email: { type: String, required: true, index: { unique: true }},
  username: { type: String, required: true, index: { unique: true }},
  password: { type:String, required: true },
  repass: { type:String, required: true },
  Address: { street: String,
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
             city: String,
             county: String,
             zip: Number
          }
});

<<<<<<< HEAD
//pass has//to read more
UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash){
       if(err) return next(err);

       user.password = hash;
       next();
    })
  })

})

UserSchema.methods.comparePasswords = function(password, callback){
  bcrypt.compare(password, this.password, callback);
}


return mongoose.model('User', UserSchema);
})();
=======
module.exports = mongoose.model('User', UserSchema);
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
