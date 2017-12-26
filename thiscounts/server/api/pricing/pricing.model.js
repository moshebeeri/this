'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let PricingSchema = new Schema({
  freeTier:[{
    date: Date,
    points: Number
  }],
  purchases: [{
    user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
    date: Date,
    payed:  Number,
    currency: String,
    points: Number
  }],
  points: Number,
  lastFreeTier: Date,
});

let ChargeSchema = new Schema({
  entityId: {type: Schema.ObjectId, index: true},
  activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true},
  entity: {
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
    brand: {type: Schema.ObjectId, ref: 'Brand', autopopulate: true},
  },
  date: Date,
  points: Number
});

PricingSchema.plugin(autopopulate);
ChargeSchema.plugin(autopopulate);

module.exports = {
  Pricing: mongoose.model('Pricing', PricingSchema),
  Charge: mongoose.model('Charge', ChargeSchema)
};
