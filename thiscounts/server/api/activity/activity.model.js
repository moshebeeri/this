'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ActivitySchema = new Schema({
  timestamp: {type: Date, default: Date.now},

  promotion: {type: Schema.ObjectId, ref: 'Promotion'},
  instance: {type: Schema.ObjectId, ref: 'Instance'},
  product: {type: Schema.ObjectId, ref: 'Product'},
  group: {type: Schema.ObjectId, ref: 'Group'},

  user: {type: Schema.ObjectId, ref: 'User'},
  business: {type: Schema.ObjectId, ref: 'Business'},
  mall: {type: Schema.ObjectId, ref: 'Mall'},
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},

  actor_user: {type: Schema.ObjectId, ref: 'User'},
  actor_business: {type: Schema.ObjectId, ref: 'Business'},
  actor_mall: {type: Schema.ObjectId, ref: 'Mall'},
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  actor_group: {type: Schema.ObjectId, ref: 'Group'},

  action: {type: String, default: ''}, //ex: has replied to:, or started following:
  message: {type: String, default: ''}

});

module.exports = mongoose.model('Activity', ActivitySchema);
