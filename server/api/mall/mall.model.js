'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MallSchema = new Schema({
  name: String,
  address: String,
  info: String,
  active: Boolean,
  lat: Number,
  long: Number,
  state: String,
  country: String,
  city: String,
  type: {
    type: String,
    enum: [ 'NEIGHBORHOOD_CENTER',
            'COMMUNITY_MALL',
            'REGIONAL_CENTER',
            'SUPER_REGIONAL_CENTER',
            'FASHION_SPECIALTY_CENTER',
            'POWER_CENTER',
            'THEME_FESTIVAL_CENTER',
            'OUTLET_CENTER']
  }
});

module.exports = mongoose.model('Mall', MallSchema);
