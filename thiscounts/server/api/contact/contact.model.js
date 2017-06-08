'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ContactSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Contact', ContactSchema);
