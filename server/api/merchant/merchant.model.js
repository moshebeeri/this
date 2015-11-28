'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MerchantSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Merchant', MerchantSchema);