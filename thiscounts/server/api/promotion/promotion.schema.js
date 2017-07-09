'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const _ = require('lodash');

function percent_range_validator(v) {
  if (_.isNull(v))
    return false;
  return v.from > 0 && v.to < 100 && v.from < v.to;
}

function entity_validator(v) {
  if (_.isNull(v))
    return false;
  return v.business || v.product || v.shopping_chain || v.mall;
}

const Entities = {
  business: {type: Schema.ObjectId, ref: 'Business'},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  mall: {type: Schema.ObjectId, ref: 'Mall'}
};

const Condition = {
  business: {type: Schema.ObjectId, ref: 'Business'},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  mall: {type: Schema.ObjectId, ref: 'Mall'},
  product: {type: Schema.ObjectId, ref: 'Product'},
  category: [{type: Number}],
  quantity: Number,
  amount: Number
};

const Distribution = {
  cards: [{type: Schema.ObjectId, ref: 'CardType'}],
  groups: [{type: Schema.ObjectId, ref: 'Group'}],
  business: {type: Schema.ObjectId, ref: 'Business'},
};

const promotionTypes = [
  'PERCENT',
  'GIFT',   // get something free if you buy
  'X+Y',
  'X+N%OFF',
  'X_FOR_Y',
  'INCREASING',
  'DOUBLING',
  'GROW',
  'PREPAY_DISCOUNT',
  'REDUCED_AMOUNT',
  'PUNCH_CARD',
  'CASH_BACK',
  'EARLY_BOOKING',
  'HAPPY_HOUR',
  'MORE_THAN'       //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
];

const Variations = ['SINGLE', 'RANGE', 'VALUES'];

// const Automatic = {
//
//   type :{type: Boolean},
//   quantity: {type: Number},
//   discount: { type : Number, min:1, max: 100},
//   types: [{type: String, enum: promotionTypes}],
//   products: [{
//     product: {type: Schema.ObjectId, ref: 'Product'},
//     description: String,
//     price: Number,
//   }],
// };

let PromotionSchemaObject = {
  social_state : {},

  //automatic: Automatic,

  name: {type: String, required: true},
  pictures : [],
  type: {
    type: String,
    enum: promotionTypes
  },

  distribution: {type:Distribution, require: true},
  condition: {type:Condition},

  //meta data
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  entity: { type: Entities, require: true,
    validate: [entity_validator, 'at least on of those fields should not be empty [business, product, chain, mall]'],
  },
  created: {type: Date, default: Date.now},
  gid: {type: Number, index: true},
  realize_gid: Number,
  saved: Date,

  report: {type: Boolean, default: false},
  system_report: {type: Boolean, default: false},
  //see https://docs.mongodb.org/manual/reference/geojson/#geospatial-indexes-store-geojson
  //{ type: "Point", coordinates: [ 40, 5 ] },
  //Always list coordinates in longitude, latitude order.
  location : {
    lng : Number,
    lat : Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  realize_code: String,
  description:String,
  start: { type : Date, default: Date.now },
  end: { type: Date, default: new Date(+new Date() + 14*24*60*60*1000) },
  expireAt: {
    type: Date
    /**validate: [ function(v) {
      return (v - new Date()) > 60000*(3600*24*14 - 1);
    }, 'Cannot expire less then 14 days in the future.' ],
     default: function() {
      // 14 days from now
      return new Date(new Date().valueOf() + 60000*3600*24*14);
    }**/
  },

  social: {
    type: String,
    enum: [
      'ROLLING',
      'GIVE_TO_FRIEND'
    ]
  },

  percent: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{ type : Number, min:1, max: 100}],
  },

  gift: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values : [{
      product: {type: Schema.ObjectId, ref: 'Product'},
      retail_price: {type: Number},
      quantity: Number
    }],
  },

  x_plus_y: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values : [{
      buy: Number,
      eligible: Number,
      quantity: Number
    }]
  },

  x_plus_n_percent_off: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      buy: Number,
      eligible: Number,
      quantity: Number
    }]
  },

  x_for_y: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      pay: Number,
      eligible: Number,
      quantity: Number
    }]
  },

  increasing: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      from: Number,
      to: Number,
      steps: Number,
      days_eligible: Number,
      quantity: Number
    }]
  },

  doubling: {
    variation: {type: String, enum: Variations},
    values_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    quantity: Number,
    values: [{
      value: Number,
      quantity: Number,
    }]
  },

  grow: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    values: [{
      quantity: Number,
      value: Number
    }]
  },

  prepay_discount: {
    variation: {type: String, enum: Variations},
    eligible_from: { type: Date },
    eligible_to: { type: Date },
    quantity: Number,
    value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    values: [{
      prepay: [Number],
      value: [Number],
      quantity: Number,
    }]
  },

  reduced_amount: {
    price: Number,
    quantity: Number,
    values: [{
      quantity: Number,
      pay: Number,
      price: Number
    }]
  },
  punch_card: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      quantity: Number,
      days: Number,
      number_of_punches: Number,
    }]
  },
  cash_back: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      quantity: Number,
      pay: Number,
      back: Number
    }],
  },
  early_booking: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      quantity: Number,
      percent: Number,
      booking_before: Date
    }],
  },
  // // get the current date and time
  // let date = new Date();
  //
  // // reset the hours, mins, seconds, ms
  // date.setHours(0, 0, 0, 0);
  //
  // // set according to the stored time
  // date.setSeconds(time);
  happy_hour: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      from: Number, // seconds from midnight
      until: Number // seconds from 'from'
    }],
  },
  more_than: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    values: [{
      product: {type: Schema.ObjectId, ref: 'Product'},
      more_than: Number,
      value: Number,
      quantity: Number
    }]
  }
};

module.exports = PromotionSchemaObject;
