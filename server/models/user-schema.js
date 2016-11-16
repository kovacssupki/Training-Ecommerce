'use strict';

var exports = module.exports = (function(){
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Create a schema
var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true},
  isActive: { type : Boolean, default : false},
  activationCode : { type: String},
  password: { type: String, required: true },
  repass: { type:String, required: true },
  Address: { street: String,
             city: String,
             county: String,
             zip: Number
          }
});


//pass hash //to read more
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
