'use strict';

/*
*
let PricingSchema = new Schema({
  charges: [{
    activity: {type: Schema.ObjectId, ref: 'Activity', autopopulate: true},
    date: Date,
    points: Number
  }],
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
  lastFreeTier: Date,
});
* */
function Pricing() {
}


Pricing.chargeActivityDistribution =
  Pricing.prototype.chargeActivityDistribution = function (entity, activity) {
    let pricing  = entity.pricing;
  };

module.exports = Pricing;

