'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ShoppingChainSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true},
  logo: String,
  pictures : [],
  video: {},
  info: String,
  active: Boolean
});

ShoppingChainSchema.index({
  name: 'text',
  info: 'text'
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
