'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let NotificationSchema = new Schema({
  read: {type: Boolean, default: false},
  action: {type: Boolean, default: false},
  to: {type: Schema.ObjectId, ref: 'User', required: true, index: true},
  timestamp: {type: Date, default: Date.now},

  promotion: {type: Schema.ObjectId, ref: 'Promotion', autopopulate: true },
  instance: {type: Schema.ObjectId, ref: 'Instance', autopopulate: true },
  product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true },
  group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },
  user: {type: Schema.ObjectId, ref: 'User', autopopulate: true },
  business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true },
  comment: {type: Schema.ObjectId, ref: 'Comment', autopopulate: true },

  actor_user: {type: Schema.ObjectId, ref: 'User', autopopulate: true },
  actor_business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  actor_mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  actor_group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },

  note: {type: String, default: ''}
});

NotificationSchema.plugin(autopopulate);

module.exports = mongoose.model('Notification', NotificationSchema);
