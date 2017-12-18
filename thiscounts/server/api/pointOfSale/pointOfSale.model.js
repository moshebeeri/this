'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PointOfSaleSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  description: String,
  active: Boolean,
  logo: String,
  client: {},
  pictures: [],
});

module.exports = mongoose.model('PointOfSale', PointOfSaleSchema);
