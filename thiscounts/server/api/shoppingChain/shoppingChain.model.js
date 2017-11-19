'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let ShoppingChainSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true},
  logo: String,
  pictures : [],
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true},
  info: String,
  active: Boolean
});
ShoppingChainSchema.plugin(autopopulate);

ShoppingChainSchema.index({
  name: 'text',
  info: 'text'
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
