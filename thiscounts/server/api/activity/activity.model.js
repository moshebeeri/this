'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let ActivitySchema = new Schema({
  timestamp: {type: Date, default: Date.now, required: true},
  distributions: Number,
  ids: [{type: Schema.ObjectId}],
  sharable: {type: Boolean, default: false},

  post: {type: Schema.ObjectId, ref: 'Post', autopopulate: true },
  promotion: {type: Schema.ObjectId, ref: 'Promotion', autopopulate: true },
  instance: {type: Schema.ObjectId, ref: 'Instance', autopopulate: true },
  product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true },
  group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },

  user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions },
  business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true },

  actor_user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions },
  actor_business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true },
  actor_mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true },
  actor_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true },
  actor_group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true },
  actor_brand: {type: Schema.ObjectId, ref: 'Brand', autopopulate: true },
  location : {
    lng : Number,
    lat : Number,
    type: {type: String},
    coordinates: []
  },
  action: {type: String, default: ''}, //ex: has replied to:, or started following:
  message: {type: String, default: ''},

  //Block reported
  feedback: {},
  blocked: Boolean,

});
ActivitySchema.plugin(autopopulate);

module.exports = mongoose.model('Activity', ActivitySchema);
