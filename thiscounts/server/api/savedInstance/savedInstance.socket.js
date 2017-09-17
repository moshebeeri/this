/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let SavedInstance = require('./savedInstance.model.js');

exports.register = function(socket) {
  SavedInstance.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  SavedInstance.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('savedInstance:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('savedInstance:remove', doc);
}
