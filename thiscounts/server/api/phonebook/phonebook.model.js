'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhonebookSchema = new Schema({
  phonebook : [],
  updated: { type : Date, default: Date.now }
});

module.exports = mongoose.model('Phonebook', PhonebookSchema);
