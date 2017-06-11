'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let BrandSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  info: String,
  active: Boolean,
  logo: String,
  pictures: [],
});

module.exports = mongoose.model('Brand', BrandSchema);
