'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');


let PricingSchema = new Schema({
  freeTier:[{
    user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
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
});

PricingSchema.plugin(autopopulate);
module.exports = mongoose.model('Pricing', PricingSchema);
