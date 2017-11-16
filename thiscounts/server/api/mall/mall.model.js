'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//http://stackoverflow.com/questions/24126985/mongodb-how-to-use-one-schema-as-sub-document-for-different-collections-defined
//let Location = require('../location/location.model')

let MallSchema = new Schema({
  social_state : {},
  name: String,
  gid: { type: Number, index: true},
  logo: String,
  pictures: [],
  video: {},
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

MallSchema.index({
  name: 'text',
  address: 'text',
  address2: 'text',
  city: 'text',
  country: 'text',
  state: 'text'
});

module.exports = mongoose.model('Mall', MallSchema);
