'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let ShoppingChainSchema = new Schema({
  social_state : {},
  pricing: {type: Schema.ObjectId, ref: 'Pricing', autopopulate: true},
  tax_id: {type: String, index: true, required: true},
  description: String,
  address: {type: String, required: true},
  address2: String,
  city: {type: String, required: true},
  country: {type: String, required: true},
  category: {type: String, required: true},
  subcategory: {type: String, required: true},
  state: {type: String},
  main_phone_number: String,
  email: {type: String, index: true, required: true},
  website: String,
  creator: {type: Schema.ObjectId, index: true, ref: 'User', required: true},
  created: {type: Date, required: true},
  name: String,
  gid: { type: Number, index: true},
  logo: String,
  branches: [{type: Schema.ObjectId, ref: 'Business', autopopulate: true}],
  pictures : [],
  letterOfIncorporation: {type: String},
  identificationCard: {type: String},
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true},
});
ShoppingChainSchema.plugin(autopopulate);

ShoppingChainSchema.index({
  name: 'text',
  info: 'text'
});

module.exports = mongoose.model('ShoppingChain', ShoppingChainSchema);
