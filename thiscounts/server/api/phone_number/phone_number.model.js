'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhoneNumberSchema = new Schema({
  contacts : [{
    user : {type: Schema.ObjectId, ref: 'Promotion', require: true, index: true},
    nick : String
  }],
  updated: { type : Date, default: Date.now }
});

module.exports = mongoose.model('PhoneNumber', PhoneNumberSchema);
