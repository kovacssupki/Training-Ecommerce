'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  instock: Number,
  price: Number
});


module.exports = mongoose.model('Product', ProductSchema);
