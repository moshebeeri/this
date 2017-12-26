'use strict';
const PricingController = require('../../api/pricing/pricing.controller');
const Charge = require('../../api/pricing/pricing.model').Charge;

function Pricing() {
}

Pricing.prototype.extractPayer = function (entity) {
  if (entity.business) return entity.business;
  if (entity.shopping_chain) return entity.shopping_chain;
  if (entity.mall) return entity.mall;
  if (entity.brand) return entity.brand;
  if (entity.user) return entity.null;
  throw new Error(`Unsupported entity type`);
};

Pricing.chargeActivityDistribution =
  Pricing.prototype.chargeActivityDistribution = function (entity, activity, callback) {
    let payer = this.extractPayer(entity);
    callback = callback ? callback : () => {
    };
    if (!payer)
      return callback(null, null);
    let pricing = payer.pricing;

    function doCharge(pricing) {
      Charge.create({
        entityId: entity._id,
        entity: entity,
        activity: activity,
        points: activity.distributions,
        date: Date.now(),
      }, function (err, charge) {
        if (err) {
          return callback(err);
        }
        pricing.points -= charge.points;
        pricing.save(callback);
        return callback(null, pricing);
      });
    }

    if (pricing) {
      doCharge(pricing);
    } else {
      PricingController.createEntityPricing(payer, function (err, payer) {
        if (err) return callback(err);
        doCharge(payer.pricing);
      })
    }
  };

Pricing.balance =
  Pricing.prototype.balance = function (entity, callback) {
    let payer = this.extractPayer(entity);

    if(!payer) //user entity
      return callback(null, null);

    if (payer.pricing.points <= 0) {
      const now = new Date();
      const prev = payer.pricing.lastFreeTier;
      const monthFromPrev = now.getMonth() - prev.getMonth() + (12 * (now.getFullYear() - prev.getFullYear()));
      if (monthFromPrev > 0) {
        let pricing = payer.pricing;
        const freePoints = {
          date: Date.now(),
          points: 100000
        };
        pricing.freeTier.push(freePoints);
        pricing.points += freePoints.points;
        pricing.save(function (err, pricing) {
          if(err) return callback(err);
          return callback(null, pricing.points);
        });
      }else{
        return callback(new Error('no points left'), payer.pricing.points);
      }
    }else{
      return callback(null, payer.pricing.points);
    }
  };

module.exports = Pricing;


