/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let CardType = require('./cardType.model');

exports.register = function(socket) {
  CardType.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  CardType.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('cardType:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('cardType:remove', doc);
}
