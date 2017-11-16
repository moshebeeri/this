'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let VideoSchema = new Schema({
  title: String,
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  created: {type: Date, required: true},
  type: {
    type: String,
    enum: [
      'THIS',
      'YOUTUBE'
    ],
    required: true
  },
  url: {
    type: String,
    required: true
  },
});
VideoSchema
  .virtual('videoId')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

module.exports = mongoose.model('Video', VideoSchema);
