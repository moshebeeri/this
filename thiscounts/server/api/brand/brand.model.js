'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let BrandSchema = new Schema({
  name: String,
  pricing: {type: Schema.ObjectId, ref: 'Pricing', autopopulate: true},
  gid: { type: Number, index: true},
  description: String,
  logo: String,
  client: {},
  pictures: [],
  letterOfIncorporation: {type: String},
  identificationCard: {type: String},
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true}
});
BrandSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Brand', BrandSchema);
