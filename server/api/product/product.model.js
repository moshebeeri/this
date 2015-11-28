'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: String,
  info: String,
  brand: {type: Schema.ObjectId, ref: 'Brand', required: false},
  retail_price: Number,
  pictures: [String],
  active: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
