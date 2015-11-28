'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  name: String,
  card_id: String,
  password: String,
  type : String,
  type_id: String,
  holder: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Card', CardSchema);
