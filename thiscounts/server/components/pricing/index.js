'use strict';
const PricingController = require('../../api/pricing/pricing.controller');

function Pricing() {
}

Pricing.prototype.extractPayerFrom = function (entity) {
  if (entity.business) return entity.business;
  if (entity.shopping_chain) return entity.shopping_chain;
  if (entity.mall) return entity.mall;
  if (entity.brand) return entity.brand;
  return null;
};

Pricing.chargeActivityDistribution =
  Pricing.prototype.chargeActivityDistribution = function (payer, activity, callback) {
    callback = callback? callback : ()=>{};
    if (!payer)
      return callback(null, null);
    let pricing = payer.pricing;

    function doCharge(pricing) {
      const charge = {
        activity: activity,
        date: Date.now(),
        points: activity.distributions
      };
      pricing.charges.push(charge);
      pricing.points -= charge.points;
      pricing.save(callback)
    }

    if(pricing){
      doCharge(pricing);
    }else{
      PricingController.createEntityPricing(payer, function (err, payer) {
        if(err) return callback(err);
        doCharge(payer.pricing);
      })
    }

  };

Pricing.payerByInstance =
  Pricing.prototype.payerByInstance = function (instance) {
    return this.payerByPromotion(instance.promotion)
  };

Pricing.payerByGroup =
  Pricing.prototype.payerByGroup = function (group) {
    return this.extractPayerFrom(group.entity);
  };

Pricing.payerByPromotion =
  Pricing.prototype.payerByPromotion = function (promotion) {
    return this.extractPayerFrom(promotion.entity);
  };
module.exports = Pricing;

