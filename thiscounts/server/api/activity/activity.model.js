'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let ActivitySchema = new Schema({
  timestamp: {type: Date, default: Date.now},
  ids: [{type: Schema.ObjectId}],
  sharable: {type: Boolean, default: true},

  promotion: {type: Schema.ObjectId, ref: 'Promotion' },
  instance: {type: Schema.ObjectId, ref: 'Instance', autopopulate: true },
  product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true },
  group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },

  user: {type: Schema.ObjectId, ref: 'User', autopopulate: true },
  business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true },

  actor_user: {type: Schema.ObjectId, ref: 'User', autopopulate: true },
  actor_business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  actor_mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  actor_group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },

  action: {type: String, default: ''}, //ex: has replied to:, or started following:
  message: {type: String, default: ''}

});

ActivitySchema.plugin(autopopulate);

module.exports = mongoose.model('Activity', ActivitySchema);
