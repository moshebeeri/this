/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Realize = require('./realize.model');

exports.register = function(socket) {
  Realize.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Realize.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('realize:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('realize:remove', doc);
}
