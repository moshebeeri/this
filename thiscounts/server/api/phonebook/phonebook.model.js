'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PhonebookSchema = new Schema({
  phonebook : [],
  updated: { type : Date, required: true }
});

module.exports = mongoose.model('Phonebook', PhonebookSchema);
