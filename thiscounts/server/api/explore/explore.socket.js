/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Explore = require('./explore.model');

exports.register = function(socket) {
  Explore.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Explore.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('explore:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('explore:remove', doc);
}
