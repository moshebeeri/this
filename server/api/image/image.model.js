'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
  objectId : Schema.ObjectId,
  type: {
    type: String,
    required: true,
    enum: [
      'USER',
      'BUSINESS',
      'PRODUCT',
      'PROMOTION',
      'MALL',
      'CATEGORY',
      'CARD_TYPE'
    ]
  }
});

module.exports = mongoose.model('Image', ImageSchema);
