'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CartSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  entity: {},
  promotion: {type: Schema.ObjectId, ref: 'Promotion', required: true}
});

module.exports = mongoose.model('Cart', CartSchema);
