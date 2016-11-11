'use strict';
var exports = module.exports = (function(){
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create a schema
var CartSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, required: true, ref:'User' },
  items: [{ type: Schema.Types.ObjectId, ref: 'Product'}]
});


return mongoose.model('Cart', CartSchema);
})();
