'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let CardTypeSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  info: String,
  qrcode: {type: Schema.ObjectId, ref:'QRCode'},
  entity: {
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
    brand: {type: Schema.ObjectId, ref: 'Brand', autopopulate: true},
    group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
  },
  add_policy: {
    type: String,
    required: true,
    enum: [
      'OPEN',
      'INVITE',
      'REQUEST'
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

CardTypeSchema.plugin(autopopulate);
CardTypeSchema.index({
  name: 'text',
  'entity.business.name': 'text',
  'entity.shopping_chain.name': 'text',
  'entity.mall.name': 'text',
  'entity.brand.name': 'text',
  'entity.group.name': 'text'
});

module.exports = mongoose.model('CardType', CardTypeSchema);
