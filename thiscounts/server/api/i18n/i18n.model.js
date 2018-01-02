'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let I18nSchema = new Schema({
  md5: {type: String, required: true},
  enUS: {type: String, required: true},
  translations:{}
});

module.exports = mongoose.model('I18n', I18nSchema);
