/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mall = require('./mall.model');

exports.register = function(socket) {
  Mall.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mall.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mall:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mall:remove', doc);
}