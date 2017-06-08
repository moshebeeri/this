/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let Merchant = require('./merchant.model');

exports.register = function(socket) {
  Merchant.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Merchant.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('merchant:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('merchant:remove', doc);
}
