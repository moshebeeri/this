'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let ProductSchema = new Schema({
  social_state : {},
  name: String,
  info: String,
  url: String,
  inAppOrder: {type:Boolean, default: false},
  deleted: {type:Boolean, default: false},
  SKU: String,
  barcode: String,
  price: Number,
  gid: { type: Number, index: true},
  brand: {type: Schema.ObjectId, ref: 'Brand', required: false},
  business: {type: Schema.ObjectId, ref: 'Business', required: false},
  shoppingChain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  retail_price: Number,
  category: {type: String, required: true},
  variants:{
    // E.G.
    // gender: 'man',
    // colors: ['black', 'pink', 'gold', 'navy'],
    // selectedColor: 'gold',
    // sizes: [{size:9, quantity:5}, {size:9.5, quantity:10}, {size:10, quantity:5}]
  },
  client: {},
  pictures: [],
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true},
});
ProductSchema.plugin(autopopulate);

ProductSchema.index({
  name: 'text',
  barcode: 'text',
  SKU: 'text',
  'business.name': 'text',
  info: 'text'
});


module.exports = mongoose.model('Product', ProductSchema);
