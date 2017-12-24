'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

//http://stackoverflow.com/questions/24126985/mongodb-how-to-use-one-schema-as-sub-document-for-different-collections-defined
//let Location = require('../location/location.model')

let TranslateSchema = new Schema({
  enUS: String,
  translations:{}
});
TranslateSchema.plugin(autopopulate);
module.exports = mongoose.model('Translate', TranslateSchema);
