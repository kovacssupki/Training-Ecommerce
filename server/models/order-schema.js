'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var OrderSchema = new mongoose.Schema({
  userId: String,
  username: String,
  confirmed: { type : Boolean, default : false},
  completed: { type : Boolean, default : false},
  cart : [{ itemId: {type: Schema.Types.ObjectId, ref: "Product" }, quantity: Number, itemName: String }]

}, { timestamps: true});


module.exports = mongoose.model('Order', OrderSchema);
