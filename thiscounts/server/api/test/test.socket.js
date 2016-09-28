/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Test = require('./test.model');

exports.register = function(socket) {
  Test.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Test.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('test:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('test:remove', doc);
}