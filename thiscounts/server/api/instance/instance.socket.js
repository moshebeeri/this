/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Instance = require('./instance.model.js');

exports.register = function(socket) {
  Instance.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Instance.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('instance:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('instance:remove', doc);
}
