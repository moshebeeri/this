'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
let Validate = require('../../components/validate');

let QRCodeType = [
  'FOLLOW_BUSINESS',
  'FOLLOW_GROUP',
  'LOYALTY_CARD',
  'LOYALTY_CARD_TYPE'
];

let Action = [
  'INFO',
  'FOLLOW',
  'APPROVE'
];

let QRCodeSchema = new Schema({
  code: { type: String, required: true, index: true },
  type: {type: String, enum: QRCodeType},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  assigned: { type: Boolean, required: true, default: false},
  assignment: {
    card: {type: Schema.ObjectId, ref: 'Card', autopopulate: true},
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
  },
  action: {type: String, enum: Action},
  message: {}
});

QRCodeSchema.plugin(autopopulate);

module.exports = mongoose.model('QRCode', QRCodeSchema);
