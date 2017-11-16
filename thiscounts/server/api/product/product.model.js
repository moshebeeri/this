'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ProductSchema = new Schema({
  social_state : {},
  name: String,
  barcode: String,
  SKU: String,
  price: Number,
  gid: { type: Number, index: true},
  info: String,
  brand: {type: Schema.ObjectId, ref: 'Brand', required: false},
  business: {type: Schema.ObjectId, ref: 'Business', required: false},
  retail_price: Number,
  category: {type: String, required: true},
  pictures: [],
  video: {},
  active: Boolean
});

ProductSchema.index({
  name: 'text',
  barcode: 'text',
  SKU: 'text',
  'business.name': 'text',
  info: 'text'
});

module.exports = mongoose.model('Product', ProductSchema);
