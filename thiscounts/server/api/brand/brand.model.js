'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let BrandSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  description: String,
  active: Boolean,
  logo: String,
  pictures: [],
});
BrandSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Brand', BrandSchema);
