'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  grade: {type: Number, required: true},
  message: { type: String, required: true},
  element_id: {type: Schema.ObjectId, required: true, index: true},

  //out put only
  creator: {type: Schema.ObjectId, ref: 'User'},
  product: {type: Schema.ObjectId, ref: 'Product'},
  promotion: {type: Schema.ObjectId, ref: 'Promotion'},
  business: {type: Schema.ObjectId, ref: 'Business'},
  mall: {type: Schema.ObjectId, ref: 'Mall'},
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);
