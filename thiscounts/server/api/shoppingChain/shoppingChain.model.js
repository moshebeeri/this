'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppingChainSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true, unique : true },
  pictures : [],
  info: String,
  active: Boolean
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
