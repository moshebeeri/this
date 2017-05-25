'use strict';

const _ = require('lodash');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  product: {type: Schema.ObjectId, ref: 'Product'},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  mall: {type: Schema.ObjectId, ref: 'Mall'}
};

const Variations = {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']};

const PromotionSchema = new Schema({
  social_state : {},
  name: {type: String, required: true},
  pictures : [],
  amount: {type: Number},
  retail_price: {type: Number},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  entity: { type: Entities, require: true,
    validate: [entity_validator, 'at least on of those fields should not be empty [business, product, chain, mall]'],
  },
  created: {type: Date, default: Date.now},
  // Eligible for certain member cards
  cards: [{type: Schema.ObjectId, ref: 'CardType'}],

  gid: { type: Number, index: true},
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
  start: { type : Date, default: Date.now },
  end: Date, // TODO: Add default
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

  category: {
    type: [{ type: String,  enum: [
      'HOT'     ,
      'LIKE'    ,
      'NEAR'    ,
      'MALL'    ,
      'FASHION' ,
      'GIFT'
    ]}],
  },
  social: {
    type: String,
    enum: [
      'ROLLING',
      'GIVE_TO_FRIEND'
    ]
  },

  type: {
    type: String,
    enum: [
      'PERCENT',
      'GIFT',   // get something free if you buy
      'AMOUNT', // reduced price by amount
      'PRICE',  // reduced new price
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
    ]
  },
  percent: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{ type : Number, min:1, max: 100}]
  },

  gift: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values : [{
      product: {type: Schema.ObjectId, ref: 'Product'},
      retail_price: {type: Number}
    }]
  },

  x_plus_y: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values : [{
      buy: Number,
      eligible: Number
    }]
  },

  x_plus_n_percent_off: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      buy: Number,
      eligible: Number
    }]
  },

  x_for_y: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      pay: Number,
      eligible: Number
    }]
  },

  increasing: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      next: Number,
      days_eligible: Number
    }]
  },

  doubling: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values_type: {type: String, enum: ['PERCENT', 'AMOUNT']},
    values: [Number],
  },

  grow: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']},
    values: [{
      quantity: Number,
      value: Number
    }]
  },

  prepay_discount: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    eligible_from: { type: Date },
    eligible_to: { type: Date },
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']},
    values: [{
      prepay: [Number],
      value: [Number],
    }]
  },

  reduced_amount: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      amount: Number,
      price: Number
    }]
  },
  punch_card: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    days: Number,
    values: [{
      number_of_punches: Number,
      eligible: String
    }]
  },
  cash_back: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      pay: Number,
      back: Number
    }],
  },
  early_booking: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      percent: Number,
      booking_before: Date
    }],
  },
  // // get the current date and time
  // var date = new Date();
  //
  // // reset the hours, mins, seconds, ms
  // date.setHours(0, 0, 0, 0);
  //
  // // set according to the stored time
  // date.setSeconds(time);
  happy_hour: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    values: [{
      from: Number, // seconds from midnight
      until: Number // seconds from 'from'
    }],
  },
  more_than: {
    type: {type: String, enum: ['SINGLE', 'RANGE', 'VALUES']},
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']},
    values: [{
      more_than: Number,
      value: Number,
      product: {type: Schema.ObjectId, ref: 'Product'},
    }]
  }
});
PromotionSchema.index({ location: '2dsphere' });

//http://mongoosejs.com/docs/2.7.x/docs/validation.html
//PromotionSchema.path('percent_range').validate(function (v, fn) {
//  fn(v.from< v.to);
//}, 'invalid range');
//

module.exports = mongoose.model('Promotion', PromotionSchema);
