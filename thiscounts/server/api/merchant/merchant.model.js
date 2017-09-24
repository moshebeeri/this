'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let MerchantSchema = new Schema({
  name: String,
  gid: {type: Number, index: true},
  entity: {
    creator: {type: Schema.ObjectId, ref: 'User', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true}
  },
  info: String,
  active: Boolean
});
MerchantSchema.plugin(autopopulate);
module.exports = mongoose.model('Merchant', MerchantSchema);
