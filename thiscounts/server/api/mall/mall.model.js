'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//http://stackoverflow.com/questions/24126985/mongodb-how-to-use-one-schema-as-sub-document-for-different-collections-defined
//var Location = require('../location/location.model')

var MallSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true},
  pictures: [],
  location : {
    lng : Number,
    lat : Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  address : {type: String, required : true},
  address2 : String,
  city : {type: String, required : true},
  country : String,
  state : {type: String, required : true},

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
