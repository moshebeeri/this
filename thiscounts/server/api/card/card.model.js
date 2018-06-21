'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let CardSchema = new Schema({
  name: String,
  points: {type: Number, default: 0},
  password: String,
  number: String,
  gid: {type: Number, index: true},
  user: {type: Schema.ObjectId, ref: 'User', index: true, autopopulate: utils.userAutopopulateOptions},
  cardType: {type: Schema.ObjectId, ref: 'CardType', autopopulate: true},
  qrcode: {type: Schema.ObjectId, ref:'QRCode'},
});
CardSchema.plugin(autopopulate);

CardSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Card', CardSchema);
