'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
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
