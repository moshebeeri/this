'use strict';

let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let CampaignPreferencesSchema = new Schema({
  within_distance_km: Number,
  age: {
    from: Number,
    to: Number
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'ALL']
  },
  state: String,
  countries: [String],
  cities: [String],
  mall: [String],
  categories: [{type: Schema.ObjectId, ref: 'Category'}],
  repurchase: {type:Number, default: 0, min: 0, max: 3 },
  first_buyers: Boolean
});

let CampaignSchema = new Schema({
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  created: {type: Date, default: Date.now},
  name: {type: String, required: true},
  gid: { type: Number, index: true},
  info: String,
  promotions: [{type: Schema.ObjectId, ref: 'Promotion', require: true}],
  match: [CampaignPreferencesSchema],
  prefer: [CampaignPreferencesSchema],
});

module.exports = mongoose.model('Campaign', CampaignSchema);
