'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const logger = require('../logger').createLogger();
const graphTools = require('../graph-tools');
const instanceGraphModel = graphTools.createGraphModel('instance');
const utils = require('../utils').createUtils();
const activity = require('../activity').createActivity();
const spatial = require('../spatial').createSpatial();
const distributor = require('../../components/distributor');
const InstanceSchema = require('../../api/instance/instance.model');
const async = require('async');

function Instances() {
}

function createInstance(promotion, value, quantity, variation) {
  return {
    promotion: promotion._id,
    type: promotion.type,
    variation: variation,
    location: promotion.location,
    quantity: quantity,
    remaining: quantity,
    value: value
  };
}

function isAutomatic(promotion) {
  return utils.defined(promotion.automatic.quantity) && utils.defined(promotion.discount);
}

Instances.createAutomaticPromotionInstances =
  Instances.prototype.createAutomaticPromotionInstances = function (promotion) {

  };

function minMax(value, value2) {
  if (value < value2) {
    return {
      min: value,
      max: value2
    }
  }
  return {
    min: value2,
    max: value
  }
}

function createPercentInstances(promotion) {
  let instances = [];
  const p = promotion.percent;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {percent: p.values[0]}, p.quantity, p.variation);
    return [instance]
  }
  else if (p.variation === 'VALUES') {
    p.values.forEach(value => {
      let instance = createInstance(promotion, value, value.quantity, p.variation);
      instances.push(instance);
    });
    return instances;
  }
  else if (p.variation === 'RANGE') {
    const minMax = minMax(p.values[0], p.values[1]);
    let spreads = distributor.distributePromotions(minMax.min, minMax.max, 5, p.quantity, p.variation);
    spreads.forEach((spread) => {
      let instance = createInstance(promotion, spread.value, spread.quantity);
      instances.push(instance);
    });
    return instances;
  } else {
    throw new Error('Missing Variation field')
  }
}

function createPunchCardInstances(promotion) {
  let instances = [];
  const p = promotion.punch_card;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, p.values[0], p.quantity, p.variation);
    return [instance]
  }
  else if (p.variation === 'VALUES') {
    p.values.forEach(value => {
      let instance = createInstance(promotion, value, value.quantity, p.variation);
      instances.push(instance);
    });
    return instances;
  }
  else if (p.variation === 'RANGE') {
    const minMax = minMax(p.values[0].number_of_punches, p.values[1].number_of_punches);
    let spreads = distributor.distributePromotions(minMax.min, minMax.max, 1, p.quantity, p.variation);
    spreads.forEach((spread) => {
      let value = {
        number_of_punches: spread.value,
        days: p.values[0].days
      };
      let instance = createInstance(promotion, value, spread.quantity);
      instances.push(instance);
    });
    return instances;
  } else {
    throw new Error('Missing Variation field')
  }
}

function createGiftInstances(promotion) {
  if (promotion.percent.variation === 'SINGLE') {
    return [promotion]
  }
}
function createXPlusYInstances(promotion) {
  if (promotion.x_plus_y.variation === 'SINGLE') {
    return [promotion]
  }
}

function createXPlusNPercentOffInstances(promotion) {
  if (promotion.x_plus_n_percent_off.variation === 'SINGLE') {
    return [promotion]
  }
}
function createXForYInstances(promotion) {
  if (promotion.x_for_y.variation === 'SINGLE') {
    return [promotion]
  }
}
function createIncreasingInstances(promotion) {
  if (promotion.increasing.variation === 'SINGLE') {
    return [promotion]
  }

}
function createDoublingInstances(promotion) {
  if (promotion.doubling.variation === 'SINGLE') {
    return [promotion]
  }
}
function createGrowInstances(promotion) {
  if (promotion.percent.variation === 'SINGLE') {
    return [promotion]
  }
}
function createPrepayInstances(promotion) {
  if (promotion.prepay_discount.variation === 'SINGLE') {
    return [promotion]
  }

}
function createReducedInstances(promotion) {
  if (promotion.reduced_amount.variation === 'SINGLE') {
    return [promotion]
  }
}
function createCashBackInstances(promotion) {
  if (promotion.cash_back.variation === 'SINGLE') {
    return [promotion]
  }
}
function createEarlyBookingInstances(promotion) {
  if (promotion.early_booking.variation === 'SINGLE') {
    return [promotion]
  }
}
function createHappyHourInstances(promotion) {
  if (promotion.happy_hour.variation === 'SINGLE') {
    return [promotion]
  }
}
function createMoreThanInstances(promotion) {
  if (promotion.more_than.variation === 'SINGLE') {
    return [promotion]
  }
}

function getValue(instance) {
  switch (instance.type) {
    case 'PERCENT':
      return instance.value.percent;
    case 'GIFT':
      return instance.value.gift;
    case 'X+Y':
      return instance.value.x_plus_y;
    case 'X+N%OFF':
      return instance.value.x_plus_n_percent_off;
    case 'X_FOR_Y':
      return instance.value.x_for_y;
    case 'INCREASING':
      return instance.value.increasing;
    case 'DOUBLING':
      return instance.value.doubling;
    case 'GROW':
      return instance.value.grow;
    case 'PREPAY_DISCOUNT':
      return instance.value.prepay;
    case 'REDUCED_AMOUNT':
      return instance.value.reduced_amount;
    case 'PUNCH_CARD':
      return instance.value.punch_card;
    case 'CASH_BACK':
      return instance.value.cash_back;
    case 'EARLY_BOOKING':
      return instance.value.early_booking;
    case 'HAPPY_HOUR':
      return instance.value.happy_hour;
    case 'MORE_THAN':
      return instance.value.more_than;
    default:
      throw new Error("unsupported promotion type");
  }
}

Instances.createPromotionInstances =
  Instances.prototype.createPromotionInstances = function (promotion) {
    let instances = [];
    switch (promotion.type) {
      case 'PERCENT': {
        let add = createPercentInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'GIFT': {   // get something free if you buy
        let add = createGiftInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'X+Y': {
        let add = createXPlusYInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'X+N%OFF': {
        let add = createXPlusNPercentOffInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'X_FOR_Y': {
        let add = createXForYInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'INCREASING': {
        let add = createIncreasingInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'DOUBLING': {
        let add = createDoublingInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'GROW': {
        let add = createGrowInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'PREPAY_DISCOUNT': {
        let add = createPrepayInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'REDUCED_AMOUNT': {
        let add = createReducedInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'PUNCH_CARD': {
        let add = createPunchCardInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'CASH_BACK': {
        let add = createCashBackInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'EARLY_BOOKING': {
        let add = createEarlyBookingInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'HAPPY_HOUR': {
        let add = createHappyHourInstances(promotion);
        instances = instances.concat(add);
      }
        break;
      case 'MORE_THAN': {       //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
        let add = createMoreThanInstances(promotion);
        instances = instances.concat(add);
      }
        break;
    }
    return instances;
  };

function to_graph(instance) {
  let value = JSON.parse(JSON.stringify(getValue(instance)));
  let ret = {
    _id: instance._id,
    quantity: instance.quantity,
    type: instance.type,
    lat: instance.location.lat,
    lon: instance.location.lng
  };

  return _.merge(ret, value);
}

function createStoreInstanceFunction(instances) {
  return function storeInstance(instance, callback) {
    InstanceSchema.create(instance, function (err, instance) {
      instance.populate('promotion', function (err, instance) {
        if (err) return callback(err);
        instanceGraphModel.reflect(instance, to_graph(instance), function (err, instance) {
          if (err) return callback(err);
          instanceGraphModel.relate_ids(instance._id, 'INSTANCE_OF', instance.promotion._id, function (err) {
            if (err) return callback(err);
            spatial.add2index(instance.gid, function (err) {
              if (err) return callback(err);
              instances.push(instance);
              callback(null, instance)
            });
          });
        })
      })
    })
  }
}


function storeInstances(instances, callback) {
  let mongooseInstances = [];
  async.each(instances, createStoreInstanceFunction(mongooseInstances), function (err) {
    if (err) return console.log(err);
    return callback(null, mongooseInstances);
  });
}

Instances.cratePromotionInstances =
  Instances.prototype.cratePromotionInstances = function (promotion, callback) {
    let instances = [];
    if (isAutomatic(promotion))
      instances = this.createAutomaticPromotionInstances(promotion);
    else
      instances = this.createPromotionInstances(promotion);
    storeInstances(instances, function (err, instances) {
      if (err) return callback(err);
      callback(null, instances);
    });
  };

module.exports = Instances;

