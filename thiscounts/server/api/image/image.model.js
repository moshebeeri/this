'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ImageSchema = new Schema({
  title: String,
  description: String,
  pictures : [],
});

module.exports = mongoose.model('Image', ImageSchema);
