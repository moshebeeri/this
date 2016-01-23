'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique : true },
  info: String,
  active: Boolean,
  pictures: [],
  background_image: String,
  text_color : Number,
  text: String,
  rank: Number
});

module.exports = mongoose.model('Category', CategorySchema);
