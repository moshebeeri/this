'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExploreSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  category: {type: Schema.ObjectId, ref: 'Category', required: true},
  sub_category: {type: String, required: false}
});

module.exports = mongoose.model('Explore', ExploreSchema);
