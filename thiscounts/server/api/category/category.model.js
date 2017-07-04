'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CategorySchema = new Schema({
  type: { type: String, index: true, required: true},
  gid: { type: Number, index: true, required: true},
  isLeaf: { type: Boolean, required: true},
  name: { type: String, index: true, required: true},
  translations:{}
});

module.exports = mongoose.model('Category', CategorySchema);
