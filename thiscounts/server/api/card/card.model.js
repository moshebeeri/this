'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  card_id: String,
  password: String,
  card_type: {type: Schema.ObjectId, ref: 'CardType'},
  type_id: String,
  holder: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Card', CardSchema);
