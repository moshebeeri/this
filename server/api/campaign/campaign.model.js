'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CampaignPreferencesSchema = new Schema({
  within_distance_km: Number,
  age: {
    from: Number,
    to: Number
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'ALL']
  },
  State: String,
  countries: [String],
  cities: [String],
  mall: [String],
  categories: [{type: Schema.ObjectId, ref: 'Category'}],
  repurchase: {type:Number, default: 0, min: 0, max: 3 },
  first_buyers: Boolean
});

var CampaignSchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique : true },
  info: String,
  promotion: {type: Schema.ObjectId, ref: 'Promotion', require: true},
  amount: Number,
  min: {type: String, default: 10, min: 1, max: 90},
  max: {type: String, default: 90, min: 1, max: 99},
  match: [CampaignPreferencesSchema],
  prefer: [CampaignPreferencesSchema],
  active: Boolean
});

module.exports = mongoose.model('Campaign', CampaignSchema);
