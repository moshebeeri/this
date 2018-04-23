'use strict';
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let Action = [
  'NONE',
  'INFO',
  'FOLLOW',
  'APPROVE',
  'OK'
];
let NotificationSchema = new Schema({
  title: {type: String, default: ''},
  body: {type: String, default: ''},
  note: {type: String, default: ''},
  to: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions, required: true, index: true},
  action: {type: String, enum: Action, default: 'NONE'},
  read: {type: Boolean, default: false},
  badge: {type: Boolean, default: false},
  list: {type: Boolean, default: true},
  timestamp: {type: Date, required: true},

  promotion: {type: Schema.ObjectId, ref: 'Promotion', autopopulate: true},
  instance: {type: Schema.ObjectId, ref: 'Instance', autopopulate: true},
  savedInstance: {type: Schema.ObjectId, ref: 'SavedInstance', autopopulate: true},
  product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
  group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
  user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
  business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
  mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
  card: {type: Schema.ObjectId, ref: 'Card', autopopulate: true},
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true},
  comment: {type: Schema.ObjectId, ref: 'Comment', autopopulate: true},
  actor_user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
  actor_business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
  actor_mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
  actor_group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
  qrcode: {type: Schema.ObjectId, ref: 'QRCode', autopopulate: true},
  available_actions: {type: String, enum: Action},
  options: {
    priority: {type: String, default: 'normal'},
    timeToLive: {type: Number, default: 60 * 60 * 24},
  }
});
NotificationSchema.plugin(autopopulate);
module.exports = mongoose.model('Notification', NotificationSchema);
