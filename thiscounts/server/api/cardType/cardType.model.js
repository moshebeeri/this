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
  points: {
    min_points: {type: Number, required: true},
    points_ratio: {type: Number, required: true},
    accumulate_ratio: {type: Number, required: true}
  },
  client: {},
  pictures: []
});

module.exports = mongoose.model('CardType', CardTypeSchema);
