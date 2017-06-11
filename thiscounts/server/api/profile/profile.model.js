'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ProfileSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Profile', ProfileSchema);
