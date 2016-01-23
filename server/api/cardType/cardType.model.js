'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardTypeSchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique : true },
  info: String,
  active: Boolean,
  issuer: String,
  issuer_id: String,
  type : {
    type: String,
    enum : [
      'BUSINESS',
      'MALL',
      'CHAIN',
      'BRAND'
    ]
  },
  pictures: []
});

module.exports = mongoose.model('CardType', CardTypeSchema);
