'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');


let PricingSchema = new Schema({
  freeTier:[{
    date: Date,
    points: Number
  }],
  purchases: [{
    date: Date,
    payed:  Number,
    currency: String,
    points: Number
  }],
  points: Number,
});

PricingSchema.plugin(autopopulate);
module.exports = mongoose.model('Pricing', PricingSchema);
