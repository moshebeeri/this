'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let OfferSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  promotion: {type: Schema.ObjectId, ref: 'Promotion', required: true}
});

module.exports = mongoose.model('Offer', OfferSchema);
