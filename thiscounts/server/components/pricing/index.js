'use strict';
const config = require('../../config/environment');

const PricingController = require('../../api/pricing/pricing.controller');
const Charge = require('../../api/pricing/pricing.model').Charge;

function Pricing() {
}

Pricing.extractPayer =
  Pricing.prototype.extractPayer = function (entity) {
  if (entity.business) return entity.business;
  if (entity.group) return Pricing.extractPayer(entity.group.entity);
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

    function chargeCost(pricing, cost) {
      if(pricing.freeTierPoints >= cost){
        pricing.freeTierPoints -= cost;
      }
      else if(pricing.purchasedPoints + pricing.freeTierPoints > cost){
        cost -= pricing.freeTierPoints;
        pricing.freeTierPoints  = 0;
        pricing.purchasedPoints -= cost;
      } else {
        cost -= pricing.freeTierPoints;
        pricing.freeTierPoints -= cost;
        pricing.freeTierPoints = 0;
      }
    }

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
        chargeCost(pricing, charge.points);
        pricing.save(callback);
        return callback(null, pricing);
      });
    }

    if (pricing) {
      doCharge(pricing);
    } else {
      PricingController.createEntityPricing(payer, function (err, payer) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        doCharge(payer.pricing);
      })
    }
  };

Pricing.firstOfThisMonth =
Pricing.prototype.firstOfThisMonth = function () {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 1)
};

Pricing.handleFreeTier =
  Pricing.prototype.handleFreeTier = function(payer, callback) {
  PricingController.createEntityPricing(payer, function (err, payer) {
    if(err) return callback(err);
    const now = new Date();
    const prev = payer.pricing.lastFreeTier;
    let pricing = payer.pricing;
    const monthFromPrev = now.getMonth() - prev.getMonth() + (12 * (now.getFullYear() - prev.getFullYear()));
    if (monthFromPrev > 0) {
      const freePoints = {
        date: Date.now(),
        points: config.pricing.freeTier
      };
      pricing.freeTier.push(freePoints);
      pricing.lastFreeTier = this.firstOfThisMonth();
      pricing.freeTierPoints += freePoints.points;
      pricing.save(function (err, pricing) {
        if (err) return callback(err);
        return callback(null, pricing.freeTierPoints);
      });
    } else {
      return callback(null, pricing.freeTierPoints);
    }
  });
};

Pricing.balance =
  Pricing.prototype.balance = function (entity, callback) {
    let payer = this.extractPayer(entity);

    if(!payer) //user entity
      return callback(null, true);
    Pricing.handleFreeTier(payer, function (err, freeTierPoints) {
      if(err) return callback(err);
      let points = freeTierPoints + payer.pricing.purchasedPoints;
      if (points <= 0){
        return callback(null, false);
      }else{
        return callback(null, true);
      }
    });
  };

module.exports = Pricing;


