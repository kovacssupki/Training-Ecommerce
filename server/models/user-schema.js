'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Create a schema
var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  username: { type: String, required: true},
  isActive: { type : Boolean, default : false},
  activationCode : { type: String},
  password: { type:String, required: true },
  address: { street: String,
             city: String,
             county: String,
             zip: Number
          }
});


module.exports = mongoose.model('User', UserSchema);
