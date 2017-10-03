'use strict';

const _ = require('lodash');
const graphTools = require('../graph-tools');
const instanceGraphModel = graphTools.createGraphModel('instance');
const utils = require('../utils').createUtils();
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
    let minMax = utils.minMax(p.values[0], p.values[1]);
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
    let instance = createInstance(promotion, {punch_card: p.values[0]}, p.quantity, p.variation);
    promotion.punch_card.product = promotion.condition.product;
    return [instance]
  }
  else if (p.variation === 'VALUES') {
    p.values.forEach(value => {
      let instance = createInstance(promotion, {punch_card: value}, value.quantity, p.variation);
      promotion.punch_card.product = promotion.condition.product;
      instances.push(instance);
    });
    return instances;
  }
  else if (p.variation === 'RANGE') {
    let minMax = utils.minMax(p.values[0].number_of_punches, p.values[1].number_of_punches);
    let spreads = distributor.distributePromotions(minMax.min, minMax.max, 1, p.quantity, p.variation);
    spreads.forEach((spread) => {
      let value = {
        number_of_punches: spread.value,
        days: p.values[0].days,
        product: promotion.condition.product,
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
  const p = promotion.gift;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      retail_price: p.values[0].retail_price,
      product: p.values[0].product,
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createXPlusYInstances(promotion) {
  const p = promotion.x_plus_y;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      buy: p.values[0].buy,
      eligible: p.values[0].eligible,
    }, p.quantity, p.variation);
    return [instance]
  }
}

function createXPlusNPercentOffInstances(promotion) {
  const p = promotion.x_plus_n_percent_off;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      buy: p.values[0].buy,
      eligible: p.values[0].eligible,
    }, p.quantity, p.variation);
    return [instance]
  }
}

function createXForYInstances(promotion) {
  const p = promotion.x_for_y;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      buy: p.values[0].buy,
      eligible: p.values[0].eligible,
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createIncreasingInstances(promotion) {
  const p = promotion.increasing;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      from: p.values[0].from,
      to: p.values[0].to,
      days_eligible: p.values[0].days_eligible
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createDoublingInstances(promotion) {
  const p = promotion.doubling;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      value: p.values[0].value,
      values_type: p.values[0].values_type
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createGrowInstances(promotion) {
  const p = promotion.grow;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      value: p.values[0].value,
      by: p.values[0].value,
      values_type: p.values[0].values_type
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createPrepayInstances(promotion) {
  const p = promotion.prepay_discount;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      value_type: p.values[0].value_type,
      eligible_from: p.values[0].eligible_from ,
      eligible_to: p.values[0].eligible_to ,
      prepay: p.values[0].prepay ,
      value: p.values[0].value
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createReducedInstances(promotion) {
  const p = promotion.reduced_amount;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      pay: p.values[0].pay,
      quantity: p.values[0].quantity,
    }, p.quantity, p.variation);
    return [instance]
  }
}

function createCashBackInstances(promotion) {
  const p = promotion.cash_back;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      pay: p.values[0].pay,
      back: p.values[0].back
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createEarlyBookingInstances(promotion) {
  const p = promotion.early_booking;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      percent: p.values[0].percent,
      booking_before: p.values[0].booking_before
    }, p.quantity, p.variation);
    return [instance]
  }
}
function createHappyHourInstances(promotion) {
  const p = promotion.happy_hour;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      product : p.values[0].product ,
      pay     : p.values[0].pay     ,
      days    : p.values[0].days    ,
      from    : p.values[0].from    ,
      until   : p.values[0].until   ,

    }, p.quantity, p.variation);
    return [instance]
  }
}
function createMoreThanInstances(promotion) {
  const p = promotion.more_than;

  if (p.variation === 'SINGLE') {
    let instance = createInstance(promotion, {
      value_type: p.values[0].value_type ,
      more_than : p.values[0].more_than  ,
      product   : p.values[0].product    ,
      value     : p.values[0].value      ,
    }, p.quantity, p.variation);
    return [instance]
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

Instances.createInstances =
  Instances.prototype.createInstances = function (promotion) {
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

Instances.getPromotionValue =
  Instances.prototype.getPromotionValue = function (promotion) {
  switch (promotion.type) {
    case 'PERCENT':
      return promotion.percent;
    case 'GIFT':
      return promotion.gift;
    case 'X+Y':
      return promotion.x_plus_y;
    case 'X+N%OFF':
      return promotion.x_plus_n_percent_off;
    case 'X_FOR_Y':
      return promotion.x_for_y;
    case 'INCREASING':
      return promotion.increasing;
    case 'DOUBLING':
      return promotion.doubling;
    case 'GROW':
      return promotion.grow;
    case 'PREPAY_DISCOUNT':
      return promotion.prepay_discount;
    case 'REDUCED_AMOUNT':
      return promotion.reduced_amount;
    case 'PUNCH_CARD':
      return promotion.punch_card;
    case 'CASH_BACK':
      return promotion.cash_back;
    case 'EARLY_BOOKING':
      return promotion.early_booking;
    case 'HAPPY_HOUR':
      return promotion.happy_hour;
    case 'MORE_THAN': return promotion.more_than;
    default:
      throw new Error("unsupported promotion type");


  }
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

Instances.createPromotionInstances =
  Instances.prototype.createPromotionInstances = function (promotion, callback) {
    promotion = promotion.toObject();
    let instances = [];
    if (isAutomatic(promotion))
      instances = this.createAutomaticPromotionInstances(promotion);
    else
      instances = this.createInstances(promotion);
    storeInstances(instances, function (err, instances) {
      if (err) return callback(err);
      callback(null, instances);
    });
  };

Instances.createSingleInstance =
  Instances.prototype.createSingleInstance = function (promotion, callback) {
    if(this.getPromotionValue(promotion).variation !== 'SINGLE' )
      return callback(new Error('createSingleInstance can only generate instance for value variation of Single'));
    let instances = this.createInstances(promotion);
    storeInstances(instances, function (err, instances) {
      if (err) return callback(err);
      callback(null, instances[0]);
    });
  };

module.exports = Instances;

