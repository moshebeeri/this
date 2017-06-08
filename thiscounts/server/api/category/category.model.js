'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: {
    type: String,  enum: [
      'HOT'     ,
      'LIKE'    ,
      'NEAR'    ,
      'MALL'    ,
      'FASHION' ,
      'GIFT'
    ],
    required: true,
    default: 'LIKE'
  },
  gid: { type: Number, index: true},
  location: {
    timestamp : { type : Date, default: Date.now },
    lat : Number,
    lng : Number,
    speed: { type : Number, default: 0}
  },
  pictures: [],
  background_image: String,
  text_color : Number,
  text: String,
  rank: Number
});

module.exports = mongoose.model('Category', CategorySchema);
