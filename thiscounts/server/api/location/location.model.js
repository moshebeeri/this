'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let LocationSchema = new Schema({

  // The valid range of latitude in degrees is -90 and +90 for the southern and northern hemisphere
  // respectively. Longitude is in the range -180 and +180 specifying the east-west position.
  locations : [{
      timestamp : { type : Date, default: Date.now },
      lat : Number,
      lng : Number,
      speed: { type : Number, default: 0}
    }],
  userId: String,
  timestamp: { type : Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);
