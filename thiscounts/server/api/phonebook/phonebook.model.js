'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PhonebookSchema = new Schema({
  phonebook : [],
  updated: { type : Date, default: Date.now }
});

module.exports = mongoose.model('Phonebook', PhonebookSchema);
