'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const RealizeSchema = new Schema({
  timestamp: {type: Date, default: Date.now},
  user: {type: Schema.ObjectId, ref: 'User'},
  instance: {type: Schema.ObjectId, ref: 'Instance'},
});

module.exports = mongoose.model('Realize', RealizeSchema);
