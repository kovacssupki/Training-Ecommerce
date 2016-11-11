'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Create a schema
var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true }},
  username: { type: String, required: true, index: { unique: true }},
  password: { type:String, required: true },
  repass: { type:String, required: true },
  Address: { street: String,
             city: String,
             county: String,
             zip: Number
          }
});

module.exports = mongoose.model('User', UserSchema);
