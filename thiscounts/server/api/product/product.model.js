'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true},
  info: String,
  brand: {type: Schema.ObjectId, ref: 'Brand', required: false},
  retail_price: Number,
  pictures: [],
  active: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
