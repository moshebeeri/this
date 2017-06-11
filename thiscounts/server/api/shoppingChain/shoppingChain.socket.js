/**
 * Broadcast updates to client when the model changes
 */

'use strict';

let ShoppingChain = require('./shoppingChain.model');

exports.register = function(socket) {
  ShoppingChain.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ShoppingChain.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('shoppingChain:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('shoppingChain:remove', doc);
}
