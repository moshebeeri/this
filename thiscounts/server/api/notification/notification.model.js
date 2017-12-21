'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let Action = [
  'NONE',
  'INFO',
  'FOLLOW',
  'APPROVE'
];

let NotificationSchema = new Schema({
  read: {type: Boolean, default: false},
  action: {type: String, enum: Action, default: 'NONE'},
  to: {type: Schema.ObjectId, ref: 'User', required: true, index: true},
  timestamp: {type: Date, required: true},

  promotion: {type: Schema.ObjectId, ref: 'Promotion', autopopulate: true },
  instance: {type: Schema.ObjectId, ref: 'Instance', autopopulate: true },
  product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true },
  group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },
  user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions },
  business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true },
  comment: {type: Schema.ObjectId, ref: 'Comment', autopopulate: true },

  actor_user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions },
  actor_business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  actor_mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  actor_group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },

  note: {type: String, default: ''},
  qrcode: {type: Schema.ObjectId, ref: 'QRCode', autopopulate: true},
  available_actions: {type: String, enum: Action}
});

NotificationSchema.plugin(autopopulate);

module.exports = mongoose.model('Notification', NotificationSchema);
