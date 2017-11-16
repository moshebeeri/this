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
    if(this.url.search("youtu.be"))
      return this.url.substr("https://youtu.be/".length);
    else if(this.url.search("youtube.com"))
      return this.url.substr("https://www.youtube.com/watch?v=".length);
    return null;
  });

module.exports = mongoose.model('Video', VideoSchema);
