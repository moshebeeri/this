'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CardTypeSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  info: String,
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
