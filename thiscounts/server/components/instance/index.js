const PromotionSchema = require('../../api/promotion/promotion.model');
const logger = require('../logger').createLogger();
const graphTools = require('../graph-tools');
const promotionGraphModel = graphTools.createGraphModel('promotion');
const instanceGraphModel = graphTools.createGraphModel('instance');
const utils = require('../utils').createUtils();
const activity = require('../activity').createActivity();
const _ = require('lodash');
let distributor = require('../../components/distributor');

'use strict';

function Instances() {
}

function clone(obj) {
  return _.cloneDeep(obj);
}

function isAutomatic(promotion) {
  return utils.defined(promotion.automatic);
}

function getPromotionType(promotion) {

}

Instances.createAutomaticPromotionInstances =
  Instances.prototype.createAutomaticPromotionInstances = function (promotion, callback) {

  };

function MinMax(value, value2) {
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
  const p = promotion.percent;
  if (p.variation === 'SINGLE') {
    return [promotion]
  }
  else if (p.variation === 'VALUES') {
    let instances = [];
    p.values.forEach(value => {
      let instance = clone(promotion);
      instance.percent.values = value;
      instances.push(instance);
    });
    return instances;
  }
  else if (p.variation === 'RANGE') {
    const minmax = MinMax(p.values[0], p.values[1]);
    let spreads = distributor.distributePromotions(minmax.min, minmax.max, 5, p.quantity);
    let instances = [];
    spreads.forEach((spread) => {
      let instance = clone(promotion);
      instance.percent.values = {
        value: spread.value,
        quantity: spread.quantity
      };
      instances.push(instance);
    });
    return instances;
  }
}
/*
 variation: {type: String, enum: Variations},
 product: {type: Schema.ObjectId, ref: 'Product'},
 values: [{
 quantity: Number,
 days: Number,
 number_of_punches: Number,
 }]
 */
function createPunchCardInstances(promotion) {
  const p = promotion.punch_card;

  if (p.variation === 'SINGLE') {
    return [promotion]
  }
  else if (p.variation === 'VALUES') {
    let instances = [];
    p.values.forEach(value => {
      let instance = clone(promotion);
      instance.punch_card.quantity = value.quantity;
      instance.punch_card.number_of_punches = value.number_of_punches;
      instances.push(instance);
    });
    return instances;
  }
  else if (p.variation === 'RANGE') {
    const minmax = MinMax(p.values[0], p.values[1]);
    let spreads = distributor.distributePromotions(minmax.min, minmax.max, 1, p.quantity);
    let instances = [];
    spreads.forEach((spread) => {
      let instance = clone(promotion);
      instance.punch_card.values = {
        value: spread.value,
        quantity: spread.quantity
      };
      instances.push(instance);
    });
    return instances;
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
  if (promotion.reduced_quantity.variation === 'SINGLE') {
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
Instances.createPromotionInstances =
  Instances.prototype.createPromotionInstances = function (promotion, callback) {
    let instances = [];
    switch (promotion.type) {
      case 'PERCENT': {
        let add = createPercentInstances(promotion.percent);
        instances.concat(add);
      }
        break;
      case 'GIFT': {   // get something free if you buy
        let add = createGiftInstances(promotion.gift);
        instances.concat(add);
      }
        break;
      case 'X+Y': {
        let add = createXPlusYInstances(promotion.x_plus_y);
        instances.concat(add);
      }
        break;
      case 'X+N%OFF': {
        let add = createXPlusNPercentOffInstances(promotion.x_plus_n_percent_off);
        instances.concat(add);
      }
        break;
      case 'X_FOR_Y': {
        let add = createXForYInstances(promotion.x_for_y);
        instances.concat(add);
      }
        break;
      case 'INCREASING': {
        let add = createIncreasingInstances(promotion.increasing);
        instances.concat(add);
      }
        break;
      case 'DOUBLING': {
        let add = createDoublingInstances(promotion.doubling);
        instances.concat(add);
      }
        break;
      case 'GROW': {
        let add = createGrowInstances(promotion.grow);
        instances.concat(add);
      }
        break;
      case 'PREPAY_DISCOUNT': {
        let add = createPrepayInstances(promotion.prepay_discount);
        instances.concat(add);
      }
        break;
      case 'REDUCED_AMOUNT': {
        let add = createReducedInstances(promotion.reduced_quantity);
        instances.concat(add);
      }
        break;
      case 'PUNCH_CARD': {
        let add = createPunchCardInstances(promotion.punch_card);
        instances.concat(add);
      }
        break;
      case 'CASH_BACK': {
        let add = createCashBackInstances(promotion.cash_back);
        instances.concat(add);
      }
        break;
      case 'EARLY_BOOKING': {
        let add = createEarlyBookingInstances(promotion.early_booking);
        instances.concat(add);
      }
        break;
      case 'HAPPY_HOUR': {
        let add = createHappyHourInstances(promotion.happy_hour);
        instances.concat(add);
      }
        break;
      case 'MORE_THAN': {       //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
        let add = createMoreThanInstances(promotion.more_than);
        instances.concat(add);
      }
        break;
    }
    return instances;
  };
let mongoose = require('mongoose');

function storeInstance(instance) {
  mongoose.connection.db.collection('instances', function (err, instances_collection) {
    if (err) return logger.error(err.message);
    instances_collection.insert(instance, )
  });

}

function storeInstances(instances) {
  instances.forEach(instance => {
    storeInstance(instance);
  })
}

Instances.cratePromotionInstances =
  Instances.prototype.cratePromotionInstances = function (promotion, callback) {
  let instances = [];
    if (isAutomatic(promotion)) {
      instances = this.createAutomaticPromotionInstances(promotion, callback);
    } else {
      instances = this.createPromotionInstances(promotion, callback);
    }
    storeInstances(instances);
  };

module.exports = Instances;

