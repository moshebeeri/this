/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let I18n = require('./i18n.model.js');

exports.register = function(socket) {
  I18n.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  I18n.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('i18n:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('i18n:remove', doc);
}
