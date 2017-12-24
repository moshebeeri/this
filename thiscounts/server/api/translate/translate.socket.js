/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Translate = require('./translate.model');

exports.register = function(socket) {
  Translate.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Translate.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('translate:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('translate:remove', doc);
}
