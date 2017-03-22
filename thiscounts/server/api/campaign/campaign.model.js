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
  state: String,
  countries: [String],
  cities: [String],
  mall: [String],
  categories: [{type: Schema.ObjectId, ref: 'Category'}],
  repurchase: {type:Number, default: 0, min: 0, max: 3 },
  first_buyers: Boolean
});

var CampaignSchema = new Schema({
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  created: {type: Date, default: Date.now},
  name: {type: String, required: true},
  gid: { type: Number, index: true},
  info: String,
  promotion: [{type: Schema.ObjectId, ref: 'Promotion', require: true}],
  match: [CampaignPreferencesSchema],
  prefer: [CampaignPreferencesSchema],
  active: Boolean
});

module.exports = mongoose.model('Campaign', CampaignSchema);
