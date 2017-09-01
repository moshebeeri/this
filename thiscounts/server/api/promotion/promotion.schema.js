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

let PromotionSchemaObject = {
  social_state : {},

  validate_barcode :{type: Boolean, default: false},

  automatic: {
    quantity: {type: Number},
    discount: { type : Number, min:1, max: 100},
    types: [{type: String, enum: promotionTypes}],
    products: [{
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      description: String,
      price: Number,
    }],
  },
  name: {type: String, required: true},
  pictures : [],
  type: {
    type: String,
    enum: promotionTypes
  },
  on_action:{
    active: {type: Boolean, default: false},
    proximity: {
      to: {type: Number, default: 0.01, min: [0.01, 'Too short'], max: [4.9, 'Too long']},
      from: {type: Number, default: 0.5, min: [0.1, 'Too short'], max: [5, 'Too long']}
    },
    type: {
      type: String,
      enum: [
        'FOLLOW_ENTITY',
        'PROXIMITY'
      ]
    },
    entity :{
      business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
      shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
      mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
      group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
    }
  },
  distribution: {
    //list of cards to distribute the promotion to
    cards: [{type: Schema.ObjectId, ref: 'CardType', autopopulate: true}],
    //list of the groups to distribute the promotion to
    groups: [{type: Schema.ObjectId, ref: 'Group', autopopulate: true}],
    //the business followers
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
  },

  condition: {
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
    product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
    category: [{type: Number}],
    quantity: Number,
    physical_unit: String,
    amount: Number,
    description: String,
  },

  //meta data
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  entity: {
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
  } ,
  created: {type: Date, default: Date.now},
  gid: {type: Number, index: true},

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

  social: {
    type: String,
    enum: [
      'ROLLING',
      'GIVE_TO_FRIEND'
    ]
  },
  //v1
  percent: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{ type : Number, min:1, max: 100}],
  },

  gift: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values : [{
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      retail_price: {type: Number},
      quantity: Number
    }],
  },
  //v1
  x_plus_y: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values : [{
      buy: Number,
      eligible: Number,
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      quantity: Number
    }]
  },
  //v1
  x_plus_n_percent_off: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      buy: Number,
      eligible: Number,
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      quantity: Number
    }]
  },
  //v1
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

  //????
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
  //v1
  reduced_amount: {
    variation: {type: String, enum: Variations},
    price: Number,
    quantity: Number,
    values: [{
      quantity: Number,
      pay: Number,
      price: Number
    }]
  },
  //v1
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
  //v1
  happy_hour: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    values: [{
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      pay: Number,
      days:[Number],
      from: Number, // seconds from midnight
      until: Number // seconds from 'from'
    }],
  },
  more_than: {
    variation: {type: String, enum: Variations},
    quantity: Number,
    value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    values: [{
      product: {type: Schema.ObjectId, ref: 'Product', autopopulate: true},
      more_than: Number,
      value: Number,
      quantity: Number
    }]
  }
};

module.exports = PromotionSchemaObject;
