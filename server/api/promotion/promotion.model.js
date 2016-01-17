'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

function percent_range_validator(v) {
  if (_.isNull(v))
    return false;
  return v.from < v.to;
}

var PromotionSchema = new Schema({
  name: {type: String, required: true},
  gid: Number,
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  created: {type: Date, default: Date.now},
  pictures : [String],
  info: String,
  active: Boolean,
  report: {type: Boolean, default: false},
  system_report: {type: Boolean, default: false},
  //report location
  location : {
    lat : String,
    lng : String
  },
  mall : {type: Schema.ObjectId, ref: 'Mall', required: false},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  business: {type: Schema.ObjectId, ref: 'Business', required: true},
  realize_code: String,
  realize_time: Date,
      type: {
    type: String,
    required: true,
    enum: [
      'PERCENT',
      'PERCENT_RANGE',
      'ROLLING',
      'GIFT',   // get something free if you buy
      'AMOUNT', // reduced price by amount
      'PRICE',  // reduced new price
      'X+Y',
      'X+N%OFF',
      'X_FOR_Y',
      'INCREASING',
      'DOUBLING',
      'ITEMS_GROW',
      'PREPAY_FOR_DISCOUNT',
      'REDUCED_AMOUNT',
      'PUNCH_CARD',
      'CASH_BACK',
      'EARLY_BOOKING',
      'HAPPY_HOUR',
      'MORE_THAN'       //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
    ]
  },
  social: {
    type: String,
    enum: [
      'ROLLING',
      'GIVE_TO_FRIEND'
    ]
  },

//  if ( req.body.price ) {
//  req.assert('price', 'Enter a price (numbers only)').regex(/^\d+(\.\d{2})?$/);
//}

  start: { type : Date, default: Date.now },
  end: Date, // TODO: Add default
  expireAt: {
    type: Date,
    validate: [ function(v) {
      return (v - new Date()) > 60000*(3600*24*14 - 1);
    }, 'Cannot expire less then 14 days in the future.' ],
    default: function() {
      // 14 days from now
      return new Date(new Date().valueOf() + 60000*3600*24*14);
    }
  },
  percent: {
    percent : { type : Number, min:1, max: 100}
  },
  percent_range: {
    from : Number,
    to :  Number,
    validate: [percent_range_validator, 'invalid range']
  },
  gift: {
    condition : String,
    gift : String
  },
  amount: {
    amount : Number
  },
  price: {
    price: Number
  },
  x_plus_y: {
    buy : Number,
    get : Number
  },
  x_plus_n_percent_off: {
    buy : Number,
    get : Number
  },
  x_for_y: {
    pay : Number,
    get : Number
  },
  increasing: {
    values : [Number],
    minimal_time_to_maintain_eligibility : Date
  },
  doubling: {
    values : [Number],
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']}
  },
  items_grow: {
    items : [Number],
    values : [Number],
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']}
  },
  prepay_for_discount: {
    prepay : [Number],
    prepay_to : { type: Date, required : true},
    eligible_from : { type: Date, required : true},
    eligible_until : { type: Date, required : true},
    value : [Number],
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']}
  },
  reduced_amount: {
    reduced_amount : Number,
    item_price : Number
  },
  punch_card: {
    number_of_punches : Number,
    eligible: String,
    minimal_time_to_maintain_eligibility : Date
  },
  cash_back: {
    amount : Number,
    back : Number
  },
  early_booking: {
    percent : Number,
    booking_before : Date
  },
  happy_hour: {
    from : Date,
    until : Date
  },
  more_than: {
    more_than : Number,
    value : [Number],
    value_type: {type: String, enum: ['PERCENT', 'AMOUNT']},
    other : String
  }
});
//http://mongoosejs.com/docs/2.7.x/docs/validation.html
//PromotionSchema.path('percent_range').validate(function (v, fn) {
//  fn(v.from< v.to);
//}, 'invalid range');
//

module.exports = mongoose.model('Promotion', PromotionSchema);


//enum: [ '',
//  '',
//  '',
//  '',
//  '',
//  '',
//  '',
//  '']
