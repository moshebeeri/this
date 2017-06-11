'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Notification', NotificationSchema);
