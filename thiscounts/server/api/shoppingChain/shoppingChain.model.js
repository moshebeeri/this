'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let ShoppingChainSchema = new Schema({
  social_state : {},
  pricing: {type: Schema.ObjectId, ref: 'Pricing', autopopulate: true},
  name: String,
  description: String,
  gid: { type: Number, index: true},
  logo: String,
  client: {},
  pictures : [],
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true},
});
ShoppingChainSchema.plugin(autopopulate);

ShoppingChainSchema.index({
  name: 'text',
  info: 'text'
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
