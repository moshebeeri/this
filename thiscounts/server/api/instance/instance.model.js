'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let InstanceSchema = new Schema({
  promotion: {type: Schema.ObjectId, ref: 'Promotion', index: true, required: true},
  gid: {type: Number, index: true},
  type: {type: String, index: true, required: true},
  location : {
    lng : Number,
    lat : Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  value: {
    percent: {
      percent: {type: Number, min: 1, max: 100},
      quantity: Number
    },
    gift: {
      product: {type: Schema.ObjectId, ref: 'Product'},
      retail_price: {type: Number},
      quantity: Number
    },
    x_plus_y: {
      buy: Number,
      eligible: Number,
      quantity: Number
    },
    x_plus_n_percent_off: {
      buy: Number,
      eligible: Number,
      quantity: Number
    },
    x_for_y: {
      pay: Number,
      eligible: Number,
      quantity: Number
    },
    increasing: {
      from: Number,
      to: Number,
      steps: Number,
      days_eligible: Number,
      quantity: Number
    },
    doubling: {
      value: Number,
      quantity: Number,
      values_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
    },
    grow: {
      value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
      quantity: Number,
      value: Number
    },
    prepay_discount: {
      value_type: {type: String, enum: ['PERCENT', 'QUANTITY']},
      eligible_from: {type: Date},
      eligible_to: {type: Date},
      prepay: Number,
      value: Number,
      quantity: Number
    },
    reduced_amount: {
      pay: Number,
      quantity: Number,
      price: Number
    },
    punch_card: {
      product: {type: Schema.ObjectId, ref: 'Product'},
      number_of_punches: Number,
      quantity: Number,
      days: Number,
    },
    cash_back: {
      quantity: Number,
      pay: Number,
      back: Number
    },
    early_booking: {
      percent: Number,
      quantity: Number,
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
      quantity: Number
    }
  }
});
InstanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Instance', InstanceSchema);
