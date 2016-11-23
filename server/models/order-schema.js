'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var OrderSchema = new mongoose.Schema({

  cart : [{ itemId: {type: Schema.Types.ObjectId, ref: "Product" }, quantity: Number, itemName: String }]

}, { timestamps: true});


module.exports = mongoose.model('Order', OrderSchema);
