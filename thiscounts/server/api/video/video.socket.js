/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Video = require('./video.model.js');

exports.register = function(socket) {
  Video.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Video.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('video:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('video:remove', doc);
}
