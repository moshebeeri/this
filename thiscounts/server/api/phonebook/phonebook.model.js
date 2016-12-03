'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhonebookSchema = new Schema({
  userId : {type: Schema.ObjectId, ref: 'User', unique : true, require: true, index: true},
  phonebook : [],
  updated: { type : Date, default: Date.now }
});

module.exports = mongoose.model('Phonebook', PhonebookSchema);
