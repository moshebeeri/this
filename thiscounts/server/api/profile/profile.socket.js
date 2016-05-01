/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Profile = require('./profile.model');

exports.register = function(socket) {
  Profile.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Profile.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('profile:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('profile:remove', doc);
}