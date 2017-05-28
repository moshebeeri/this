const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const logger = require('../logger').createLogger();
const graphTools = require('../graph-tools');
const instanceGraphModel = graphTools.createGraphModel('instance');
const utils = require('../utils').createUtils();
const activity = require('../activity').createActivity();
const spatial = require('../spatial').createSpatial();
const _ = require('lodash');
let distributor = require('../../components/distributor');
let promotionSchemaObject = require('../../api/promotion/promotion.schema');

'use strict';

delete promotionSchemaObject.percent.values;
promotionSchemaObject.percent.value = { type : Number, min:1, max: 100};
delete promotionSchemaObject.gift.values;
promotionSchemaObject.gift.value = {
  product: {type: Schema.ObjectId, ref: 'Product'},
  retail_price: {type: Number}
};
delete promotionSchemaObject.x_plus_y.values;
promotionSchemaObject.x_plus_y.value = {
  buy: Number,
  eligible: Number
};
delete promotionSchemaObject.x_plus_n_percent_off.values;
promotionSchemaObject.x_plus_n_percent_off.value = {
  buy: Number,
  eligible: Number
};
delete promotionSchemaObject.x_for_y.values;
promotionSchemaObject.x_for_y.value = {
  pay: Number,
  eligible: Number
};
delete promotionSchemaObject.increasing.values;
promotionSchemaObject.increasing.value = {
  next: Number,
  days_eligible: Number
};
delete promotionSchemaObject.doubling.values;
promotionSchemaObject.doubling.value = Number;
delete promotionSchemaObject.grow.values;
promotionSchemaObject.grow.value = {
  quantity: Number,
  value: Number
};
delete promotionSchemaObject.prepay_discount.values;
promotionSchemaObject.prepay_discount.value = {
  prepay: [Number],
  value: [Number],
};
delete promotionSchemaObject.reduced_quantity.values;
promotionSchemaObject.reduced_quantity.value = {
  quantity: Number,
  price: Number
};
delete promotionSchemaObject.punch_card.values;
promotionSchemaObject.punch_card.value = {
  quantity: Number,
  days: Number,
  number_of_punches: Number,
};
delete promotionSchemaObject.cash_back.values;
promotionSchemaObject.cash_back.value = {
  pay: Number,
  back: Number
};
delete promotionSchemaObject.early_booking.values;
promotionSchemaObject.early_booking.value = {
  percent: Number,
  booking_before: Date
};
delete promotionSchemaObject.happy_hour.values;
promotionSchemaObject.happy_hour.value = {
  from: Number, // seconds from midnight
  until: Number // seconds from 'from'
};
delete promotionSchemaObject.more_than.values;
promotionSchemaObject.more_than.value = {
  more_than: Number,
  value: Number,
  product: {type: Schema.ObjectId, ref: 'Product'},
};

let InstanceSchema = mongoose.model('Instance', promotionSchemaObject);

function Instances() {
}

function clone(promotion) {
  let instance =  JSON.parse(JSON.stringify(promotion));
  delete instance._id
  return instance;
}

function isAutomatic(promotion) {
  return utils.defined(promotion.automatic.quantity) && utils.defined(promotion.discount);
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
    let instance = clone(promotion);
    instance.percent.values = instance.percent.values[0];
    return [instance]
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
    const minMax = MinMax(p.values[0], p.values[1]);
    let spreads = distributor.distributePromotions(minMax.min, minMax.max, 5, p.quantity);
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
  } else {
    throw new Error('Missing Variation field')
  }
}

function createPunchCardInstances(promotion) {
  const p = promotion.punch_card;

  if (p.variation === 'SINGLE') {
    let instance = clone(promotion);
    instance.punch_card.values = instance.punch_card.values[0];
    return [instance]
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
    const minMax = MinMax(p.values[0], p.values[1]);
    let spreads = distributor.distributePromotions(minMax.min, minMax.max, 1, p.quantity);
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
  return {
    _id: instance._id,
    value: instance.value,
    type: instance.type,
    lat: instance.location.lat,
    lon: instance.location.lng,
  }
}

function storeInstance(promotion, instance) {
  InstanceSchema.create(instance, function (err, instance) {
    if (err) return console.error(err);
    instanceGraphModel.reflect(instance, to_graph(instance), function (err, instance) {
      if (err) return console.error(err);
      instanceGraphModel.relate_ids(instance._id, 'INSTANCE_OF', promotion._id, function (err) {
        if (err) return console.error(err);
        spatial.add2index(promotion.gid, function (err) {
          if (err) return console.error(err);

        });
      });
    })
  })
}

function storeInstances(promotion, instances) {
  if (!instances)
    return;
  instances.forEach(instance => {
    storeInstance(promotion, instance);
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
    storeInstances(promotion, instances);
  };

module.exports = Instances;

