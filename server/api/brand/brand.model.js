'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BrandSchema = new Schema({
  name: String,
  gid: Number,
  info: String,
  active: Boolean,
  logo: String,
  pictures: [],
});

module.exports = mongoose.model('Brand', BrandSchema);
