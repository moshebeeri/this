'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ImageSchema = new Schema({
  title: String,
  description: String,
  orientation: {
    type: String,
    required: false,
    enum: [
      'UNKNOWN',
      'LANDSCAPE',
      'PORTRAIT'
    ],
    default : 'UNKNOWN'
  }
});

module.exports = mongoose.model('Image', ImageSchema);
