'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const savedDataTypes = [
  'INCREASING',
  'DOUBLING',
  'GROW',
  'PREPAY_DISCOUNT',
  'PUNCH_CARD',
  'CASH_BACK',
  'EARLY_BOOKING'
 ];

let SavedInstanceSchema = new Schema({
  gid: { type: Number, index: true},
  created: {type: Date, default: Date.now()},
  user: {type: Schema.ObjectId, ref: 'User', required: true},
  instance: {type: Schema.ObjectId, ref: 'Instance', required: true},
  type: {type: String, required: true},
  savedDataType: {type: String, enum: savedDataTypes},
  savedData: {
    increasing: {
      redeemTime: {type: Date, default: Date.now()},
      from: Number,
      to: Number,
      days_eligible: Number,
    },
    doubling: {
      redeemTime: {type: Date, default: Date.now()},
      value: Number,
    },
    grow: {
      redeemTime: {type: Date, default: Date.now()},
      value: Number,
    },
    prepay_discount: {
      redeemTime: {type: Date, default: Date.now()},
      value: Number,
      eligible_from: {type: Date},
      eligible_to: {type: Date},
      prepay: Number,
    },
     punch_card: {
      redeemTimes: [{type: Date, default: Date.now()}],
      product: {type: Schema.ObjectId, ref: 'Product'},
      number_of_punches: Number,
      days: Number,
    },
    cash_back: {
      redeemTime: {type: Date, default: Date.now()},
      pay: Number,
      back: Number
    },
    early_booking: {
      redeemTime: {type: Date, default: Date.now()},
      percent: Number,
      booking_before: Date
    }
  }

});

module.exports = mongoose.model('SavedInstance', SavedInstanceSchema);
