'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PhoneNumberSchema = new Schema({
  _id: String,
  owner : {type: Schema.ObjectId, ref: 'User', require: false, index: true},
  contacts : [{
    user : {type: Schema.ObjectId, ref: 'User', require: true, index: true},
    nick : String
  }],
  updated: { type : Date, required: true }
});

module.exports = mongoose.model('PhoneNumber', PhoneNumberSchema);
