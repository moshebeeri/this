'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

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
  created: {type: Date},
  user: {type: Schema.ObjectId, ref: 'User', required: true, autopopulate: utils.userAutopopulateOptions },
  instance: {type: Schema.ObjectId, ref: 'Instance', required: true, autopopulate: true },
  type: {type: String, required: true},
  savedDataType: {type: String, enum: savedDataTypes},
  savedData: {
    increasing: {
      firstRedeemTime: {type: Date},
      secondRedeemTime: {type: Date},
      from: Number,
      to: Number,
      days_eligible: Number,
    },
    doubling: {
      firstRedeemTime: {type: Date},
      secondRedeemTime: {type: Date},
      value: Number,
    },
    grow: {
      firstRedeemTime: {type: Date},
      secondRedeemTime: {type: Date},
      value: Number,
      by: Number,
    },
    prepay_discount: {
      firstRedeemTime: {type: Date},
      secondRedeemTime: {type: Date},
      value: Number,
      eligible_from: {type: Date},
      eligible_to: {type: Date},
      prepay: Number,
    },
     punch_card: {
      won: {type: Boolean, default: false},
      redeemTimes: [{type: Date}],
      product: {type: Schema.ObjectId, ref: 'Product'},
      number_of_punches: Number,
      days: Number,
    },
    cash_back: {
      redeemTime: {type: Date},
      pay: Number,
      back: Number
    },
    early_booking: {
      redeemTime: {type: Date},
      percent: Number,
      booking_before: Date
    },
    other:{
      redeemTime: {type: Date},
    }
  }

});
SavedInstanceSchema.plugin(autopopulate);

module.exports = mongoose.model('SavedInstance', SavedInstanceSchema);
