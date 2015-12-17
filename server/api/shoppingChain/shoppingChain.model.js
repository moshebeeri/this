'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppingChainSchema = new Schema({
  name: String,
  gid: Number,
  pictures : [String],
  info: String,
  active: Boolean
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
