'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let InstanceSchema = new Schema({
  social_state : {},
  promotion: {type: Schema.ObjectId, ref: 'Promotion', index: true, required: true},
  gid: {type: Number, index: true},
  type: {type: String, index: true, required: true},
  variation: {type: String, index: true, required: true},

  quantity: Number,
  remaining: Number,
  realizations: [{type: Schema.ObjectId, ref: 'Realized', index: true, required: true}],

  location : {
    lng : Number,
    lat : Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  value: {
    percent: {type: Number, min: 1, max: 100},

    gift: {
      product: {type: Schema.ObjectId, ref: 'Product'},
      retail_price: {type: Number},
    },
    x_plus_y: {
      buy: Number,
      eligible: Number,
    },
    x_plus_n_percent_off: {
      buy: Number,
      eligible: Number,
    },
    x_for_y: {
      pay: Number,
      eligible: Number,
    },
    increasing: {
      from: Number,
      to: Number,
      days_eligible: Number,
    },
    doubling: {
      value: Number,
      values_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    },
    grow: {
      value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
      value: Number
    },
    prepay_discount: {
      value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
      eligible_from: {type: Date},
      eligible_to: {type: Date},
      prepay: Number,
      value: Number,
    },
    reduced_amount: {
      pay: Number,
      price: Number
    },
    punch_card: {
      product: {type: Schema.ObjectId, ref: 'Product'},
      number_of_punches: Number,
      days: Number,
    },
    cash_back: {
      pay: Number,
      back: Number
    },
    early_booking: {
      percent: Number,
      booking_before: Date
    },
    happy_hour: {
      from: Number, // seconds from midnight
      until: Number // seconds from 'from'
    },
    more_than: {
      value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
      more_than: Number,
      product: {type: Schema.ObjectId, ref: 'Product'},
      value: Number,
    }
  }
});
InstanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Instance', InstanceSchema);
