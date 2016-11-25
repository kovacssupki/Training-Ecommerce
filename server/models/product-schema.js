'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  instock: Number,
  imageUrl: String
});


module.exports = mongoose.model('Product', ProductSchema);
