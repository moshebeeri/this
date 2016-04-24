'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique : true },
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Contact', ContactSchema);
