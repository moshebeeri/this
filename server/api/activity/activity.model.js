'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  timestamp: {type: Date, default: Date.now},

  promotion: {type: Schema.ObjectId, ref: 'Promotion'},

  user: {type: Schema.ObjectId, ref: 'User'},
  business: {type: Schema.ObjectId, ref: 'Business'},
  mall: {type: Schema.ObjectId, ref: 'Mall'},
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},

  actor_user: {type: Schema.ObjectId, ref: 'User'},
  actor_business: {type: Schema.ObjectId, ref: 'Business'},
  actor_mall: {type: Schema.ObjectId, ref: 'Mall'},
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},

  action: {type: String, default: ""} //ex: has replied to:, or started following:
});

module.exports = mongoose.model('Activity', ActivitySchema);
